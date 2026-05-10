#!/usr/bin/env bash
set -euo pipefail

LOG_FILE="${LOG_FILE:-/tmp/system-monitor.log}"
INTERVAL_SECONDS="${INTERVAL_SECONDS:-300}"

timestamp() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

cpu_usage() {
  case "$(uname -s)" in
    Darwin)
      top -l 1 -n 0 | awk -F'[:, ]+' '/CPU usage/ {
        user=$3; sys=$5; gsub("%", "", user); gsub("%", "", sys);
        printf "%.1f%%", user + sys
      }'
      ;;
    Linux)
      awk '
        NR==1 {
          idle=$5; total=0;
          for (i=2; i<=NF; i++) total += $i;
          getline < "/proc/stat";
          idle2=$5; total2=0;
          for (i=2; i<=NF; i++) total2 += $i;
          usage=(1 - (idle2-idle)/(total2-total)) * 100;
          printf "%.1f%%", usage
        }' /proc/stat
      ;;
    *)
      echo "unknown"
      ;;
  esac
}

memory_usage() {
  case "$(uname -s)" in
    Darwin)
      vm_stat | awk '
        /page size of/ { page=$8 }
        /Pages active/ { active=$3 }
        /Pages wired/ { wired=$4 }
        /Pages compressed/ { compressed=$3 }
        /Pages free/ { free=$3 }
        END {
          gsub("\\.", "", active); gsub("\\.", "", wired);
          gsub("\\.", "", compressed); gsub("\\.", "", free);
          used=(active+wired+compressed)*page/1024/1024;
          total=(active+wired+compressed+free)*page/1024/1024;
          if (total > 0) printf "%.1f%% (%dMB/%dMB)", used/total*100, used, total;
          else printf "unknown";
        }'
      ;;
    Linux)
      free -m | awk '/Mem:/ { printf "%.1f%% (%dMB/%dMB)", $3/$2*100, $3, $2 }'
      ;;
    *)
      echo "unknown"
      ;;
  esac
}

disk_usage() {
  df -h / | awk 'NR==2 { printf "%s used of %s (%s)", $3, $2, $5 }'
}

write_sample() {
  printf "%s | cpu=%s | memory=%s | disk=%s\n" \
    "$(timestamp)" \
    "$(cpu_usage)" \
    "$(memory_usage)" \
    "$(disk_usage)" >> "$LOG_FILE"
}

if [[ "${1:-}" == "--once" ]]; then
  write_sample
  exit 0
fi

while true; do
  write_sample
  sleep "$INTERVAL_SECONDS"
done

