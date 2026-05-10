# TaskFlow REST API Documentation

Base URL: `https://api.taskflow.example/v1`

Authentication: send `Authorization: Bearer <token>` on every request. Tokens are scoped per workspace and may be rotated from the workspace settings page.

Content type: requests with a body use `Content-Type: application/json`.

## Error Format

```json
{
  "error": {
    "code": "validation_failed",
    "message": "The request body is invalid.",
    "details": [{ "field": "title", "issue": "Required" }]
  }
}
```

Common status codes:

- `400` - Invalid request body or query parameter.
- `401` - Missing, expired, or invalid bearer token.
- `403` - Token lacks the required workspace permission.
- `404` - Resource was not found in the current workspace.
- `409` - Request conflicts with current resource state.
- `429` - Rate limit exceeded. Retry after the `Retry-After` header.
- `500` - Unexpected server error.

## 1. Create Task

`POST /tasks`

Creates a task in the authenticated workspace.

Request:

```json
{
  "title": "Prepare launch checklist",
  "description": "Confirm release blockers and owner sign-offs.",
  "assigneeId": "usr_123",
  "dueAt": "2026-05-20T17:00:00Z",
  "priority": "high"
}
```

Response `201`:

```json
{
  "id": "tsk_001",
  "title": "Prepare launch checklist",
  "status": "open",
  "priority": "high",
  "createdAt": "2026-05-10T21:00:00Z"
}
```

## 2. List Tasks

`GET /tasks?status=open&assigneeId=usr_123&limit=25&cursor=tsk_001`

Returns a paginated task list.

Response `200`:

```json
{
  "items": [{ "id": "tsk_001", "title": "Prepare launch checklist", "status": "open" }],
  "nextCursor": "tsk_026"
}
```

## 3. Get Task

`GET /tasks/{taskId}`

Response `200`:

```json
{
  "id": "tsk_001",
  "title": "Prepare launch checklist",
  "description": "Confirm release blockers and owner sign-offs.",
  "status": "open",
  "assigneeId": "usr_123",
  "dueAt": "2026-05-20T17:00:00Z"
}
```

## 4. Update Task

`PATCH /tasks/{taskId}`

Request:

```json
{
  "title": "Prepare final launch checklist",
  "priority": "urgent"
}
```

Response `200` returns the updated task object.

## 5. Complete Task

`POST /tasks/{taskId}/complete`

Request:

```json
{
  "completedBy": "usr_123",
  "resolutionNote": "All launch blockers cleared."
}
```

Response `200`:

```json
{
  "id": "tsk_001",
  "status": "completed",
  "completedAt": "2026-05-11T09:30:00Z"
}
```

## 6. Add Comment

`POST /tasks/{taskId}/comments`

Request:

```json
{
  "body": "Legal approved the public copy.",
  "mentions": ["usr_456"]
}
```

Response `201`:

```json
{
  "id": "cmt_100",
  "taskId": "tsk_001",
  "body": "Legal approved the public copy.",
  "authorId": "usr_123",
  "createdAt": "2026-05-11T10:00:00Z"
}
```

## 7. Upload Attachment

`POST /tasks/{taskId}/attachments`

Request:

```json
{
  "filename": "launch-checklist.pdf",
  "contentType": "application/pdf",
  "sizeBytes": 84212
}
```

Response `201`:

```json
{
  "id": "att_777",
  "uploadUrl": "https://uploads.taskflow.example/signed-url",
  "expiresAt": "2026-05-11T10:15:00Z"
}
```

## 8. Create Project

`POST /projects`

Request:

```json
{
  "name": "Spring Launch",
  "ownerId": "usr_123"
}
```

Response `201`:

```json
{
  "id": "prj_001",
  "name": "Spring Launch",
  "ownerId": "usr_123",
  "createdAt": "2026-05-10T21:00:00Z"
}
```

## 9. List Project Members

`GET /projects/{projectId}/members`

Response `200`:

```json
{
  "items": [
    { "userId": "usr_123", "role": "owner" },
    { "userId": "usr_456", "role": "editor" }
  ]
}
```

## 10. Invite Project Member

`POST /projects/{projectId}/members`

Requires `project:admin` scope.

Request:

```json
{
  "email": "new.member@example.com",
  "role": "viewer"
}
```

Response `202`:

```json
{
  "inviteId": "inv_900",
  "email": "new.member@example.com",
  "role": "viewer",
  "status": "pending"
}
```

## Rate Limits

Authenticated clients may make 600 requests per minute per workspace. Responses include:

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

