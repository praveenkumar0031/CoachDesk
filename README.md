🧑‍🏫 CoachDesk — Smart Coach Management System

A full-stack Coach Management Admin Panel built with React (Vite) on the frontend and Node.js + Express + Firebase Realtime Database on the backend.
The system allows administrators to manage coaches — including adding, updating, filtering, sorting, and deleting — with a responsive and elegant interface.



🔹 Frontend: React + TypeScript + Tailwind CSS

🔹 Backend: Node.js + Express + Firebase Admin SDK

🔹 Database: Firebase Realtime Database

🔹 Features: Filtering, Sorting, Pagination, Search by ID

🔹 UI: Dynamic, responsive, and loading animation while fetching data

🔹 Deployment: Frontend (Vercel / Netlify), Backend (Render / Railway)


⚡ API Endpoints
| Method | Endpoint           | Description                                 |
| ------ | ------------------ | ------------------------------------------- |
| GET    | `/api/coaches`     | Fetch all coaches (with filters/pagination) |
| GET    | `/api/coaches/:id` | Fetch a coach by ID                         |
| POST   | `/api/coaches`     | Add a new coach                             |
| PUT    | `/api/coaches/:id` | Update existing coach                       |
| DELETE | `/api/coaches/:id` | Delete coach                                |

🧩Tech Stack:

🔹Frontend

    ⚛️ React + TypeScript (Vite)

    💅 TailwindCSS for styling

    🔄 React Query (or Zustand) for data fetching/state

    🎨 Shadcn/UI for clean UI components (optional but recommended)

    🔔 Toast notifications via react-hot-toast

🔹Backend

    🟢 Node.js + Express

    🔥 Firebase Admin SDK (Realtime Database)

    🌍 dotenv


🧠 Core Functionalities

| Feature        | Description                                               |
| -------------- | --------------------------------------------------------- |
| ➕ Add Coach    | Add new coach with name, email, category, rating, status  |
| ✏️ Edit Coach  | Update existing coach information                         |
| ❌ Delete Coach | Remove a coach by ID                                      |
| 🔍 Search      | Search by numeric ID                                      |
| 🗂 Filter      | Filter by status, category, or rating                     |
| 📊 Pagination  | Client-side pagination and sorting                        |
| ⚡ Realtime     | Data stored and retrieved from Firebase Realtime Database |


🌐 API Endpoints

| Method   | Endpoint           | Description                               |
| -------- | ------------------ | ----------------------------------------- |
| `GET`    | `/api/coaches`     | Fetch all coaches with filters/pagination |
| `GET`    | `/api/coaches/:id` | Get a coach by numeric ID                 |
| `POST`   | `/api/coaches`     | Add a new coach                           |
| `PUT`    | `/api/coaches/:id` | Update an existing coach                  |
| `DELETE` | `/api/coaches/:id` | Delete a coach                            |


🧮 Filters on Api

| Example URL                                  | Description                           |
| -------------------------------------------- | ------------------------------------- |
| `GET /coaches?status=active`                 | Get all active coaches                |
| `GET /coaches?category=fitness`              | Get all fitness coaches               |
| `GET /coaches?rating=4`                      | Get coaches with rating ≥ 4           |
| `GET /coaches?status=inactive&category=yoga` | Combine multiple filters              |
| `GET /coaches?category=fit&rating=3`         | Partial category match and min rating |

📊 Pagination 

| Example URL                             | Description                          |
| --------------------------------------- | ------------------------------------ |
| `/coaches?page=1&limit=3`               | First 3 coaches                      |
| `/coaches?page=2&limit=3`               | Next 3 coaches                       |
| `/coaches?status=active&limit=2`        | Only active coaches, paginated       |
| `/coaches?category=yoga&page=2&limit=2` | Filter and paginate together         |
| `/coaches?rating=4&page=1&limit=5`      | Coaches with rating ≥ 4 (first page) |


🧑‍💻 Author

Praveen Kumar S
📧 praveen0031kumar@gmail.com
🔗 [Portfolio](https://praveenkumar0031.github.io/portfolio)

🪪 License

This project is licensed under the MIT License.
Feel free to use, modify, and distribute with attribution.