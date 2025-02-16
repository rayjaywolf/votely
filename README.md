### Frontend

- React with TypeScript
- React Router for navigation
- Shadcn UI components
- Tailwind CSS for styling
- Lucide React for icons
- Sonner for toast notifications

### Backend

- Node.js with Express
- Prisma ORM
- PostgreSQL database
- Zod for validation

## API Endpoints

| Method | Endpoint              | Description             | Request Body                              |
| ------ | --------------------- | ----------------------- | ----------------------------------------- |
| POST   | `/api/polls`          | Create a new poll       | `{ question: string, options: string[] }` |
| GET    | `/api/polls`          | Get all polls           | -                                         |
| GET    | `/api/polls/:id`      | Get a specific poll     | -                                         |
| POST   | `/api/polls/:id/vote` | Vote on a poll option   | `{ optionId: string }`                    |
| DELETE | `/api/polls/:id/vote` | Remove vote from option | `{ optionId: string }`                    |

## Database Schema

```prisma
model Poll {
  id        String   @id @default(cuid())
  question  String
  options   Option[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Option {
  id      String @id @default(cuid())
  text    String
  votes   Int    @default(0)
  pollId  String
  poll    Poll   @relation(fields: [pollId], references: [id], onDelete: Cascade)
}
```
