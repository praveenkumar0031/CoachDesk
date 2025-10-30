A Mini Admin Panel for managing Coaches (CRUD UI + filtering + rating + status toggle).

Tech Stack:

⚛️ React + TypeScript (Vite)

💅 TailwindCSS for styling

🔄 React Query (or Zustand) for data fetching/state

🎨 Shadcn/UI for clean UI components (optional but recommended)

🔔 Toast notifications via react-hot-toast



| Action          | Method | URL                                                                |
| --------------- | ------ | ------------------------------------------------------------------ |
| Get all coaches | GET    | [http://localhost:5000/coaches](http://localhost:5000/coaches)     |
| Get coach by ID | GET    | [http://localhost:5000/coaches/1](http://localhost:5000/coaches/1) |
| Add new coach   | POST   | [http://localhost:5000/coaches](http://localhost:5000/coaches)     |
| Update coach    | PUT    | [http://localhost:5000/coaches/1](http://localhost:5000/coaches/1) |
| Delete coach    | DELETE | [http://localhost:5000/coaches/1](http://localhost:5000/coaches/1) |

Filters on Api

| Example URL                                  | Description                           |
| -------------------------------------------- | ------------------------------------- |
| `GET /coaches?status=active`                 | Get all active coaches                |
| `GET /coaches?category=fitness`              | Get all fitness coaches               |
| `GET /coaches?rating=4`                      | Get coaches with rating ≥ 4           |
| `GET /coaches?status=inactive&category=yoga` | Combine multiple filters              |
| `GET /coaches?category=fit&rating=3`         | Partial category match and min rating |

Pagination 

| Example URL                             | Description                          |
| --------------------------------------- | ------------------------------------ |
| `/coaches?page=1&limit=3`               | First 3 coaches                      |
| `/coaches?page=2&limit=3`               | Next 3 coaches                       |
| `/coaches?status=active&limit=2`        | Only active coaches, paginated       |
| `/coaches?category=yoga&page=2&limit=2` | Filter and paginate together         |
| `/coaches?rating=4&page=1&limit=5`      | Coaches with rating ≥ 4 (first page) |

Sorting 

| Endpoint                                                 | Description                 |
| -------------------------------------------------------- | --------------------------- |
| `/coaches?sort=rating&order=desc`                        | Sort by highest rating      |
| `/coaches?sort=name&order=asc`                           | Sort alphabetically by name |
| `/coaches?status=active&sort=category`                   | Filter + sort               |
| `/coaches?rating=3&sort=rating&order=asc&page=2&limit=3` | Filter + sort + paginate    |
