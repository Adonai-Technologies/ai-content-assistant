
# 🧠 AI Content Assistant (Permit.io Challenge Submission)

An AI-powered content summarization app with **fine-grained access control** using [Permit.io](https://www.permit.io/). This project is built for the **AI Access Control Challenge** and demonstrates how to enforce role-based permissions around AI usage.

---

## ✨ Features

- 📝 **Users** can summarize text content using a mocked AI summarizer.
- ✅ **Admins** can review and approve or reject submitted summaries.
- 👁️ Only approved summaries are published and viewable.
- 🔐 All access is protected via **Permit.io fine-grained authorization**.
- ⚙️ Built with **Node.js** (Express), Permit.io SDK, and mocked AI.

---

## 🔧 Tech Stack

| Layer     | Technology                |
|-----------|---------------------------|
| Backend   | Node.js, Express.js       |
| AuthZ     | Permit.io                 |
| AI Logic  | OpenAI (Mocked for now)   |
| Frontend  | React + Tailwind (optional) |
| Storage   | In-memory (for simplicity) |

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/YOUR_USERNAME/ai-content-assistant.git
cd ai-content-assistant
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the root directory:

```env
PERMIT_API_KEY=your_permitio_api_key
OPENAI_API_KEY=mocked-or-placeholder
```

*Note: OpenAI is mocked in this version, so the API key is not used.*

### 4. Run the Backend Server

```bash
node index.js
```

Your backend will be running at:  
📍 `http://localhost:3001`

---

## 👥 Users and Roles

| Username | Password         | Role   | Permissions                       |
|----------|------------------|--------|-----------------------------------|
| admin    | 2025DEVChallenge | admin  | summarize, review, view           |
| newuser  | 2025DEVChallenge | user   | summarize                         |

> Roles are defined and enforced in Permit.io.

---

## 🛠️ Permit.io Configuration

The following resources and permissions were created in the Permit.io dashboard:

### Resources
- **content**

### Actions
- `summarize` – allowed for users and admins
- `review` – allowed for admins only
- `view` – allowed for admins only

### Roles
- `admin` – can `summarize`, `review`, and `view`
- `user` – can only `summarize`

---

## 📦 API Endpoints

### `POST /auth/login`

Authenticate user.

```json
{
  "username": "admin",
  "password": "2025DEVChallenge"
}
```

---

### `POST /ai/summarize`

Submit content for AI summarization (mocked).

```json
{
  "content": "Your long paragraph here...",
  "user": "admin"
}
```

Returns: mocked summary + pending status

---

### `GET /review?user=admin`

Get list of summaries with status "pending".

---

### `POST /review/:id`

Approve or reject a summary.

```json
{
  "user": "admin",
  "action": "approved" // or "rejected"
}
```

---

### `GET /published?user=admin`

View all approved (published) summaries.

---

## 🔒 Authorization Enforcement

Every route performs a **real-time check** with Permit.io PDP:

```js
const allowed = await permit.check(user, action, resource);
```

This ensures security is **externalized** and fully **declarative**.

---

## 🧪 Mocked AI for Development

Instead of using OpenAI directly (to avoid quota issues), we use:

```js
const summary = `Summary (mocked): ${content.slice(0, 100)}...`;
```

You can later replace this with a real API call to OpenAI, Anthropic, etc.

---

## ✅ Challenge Criteria Checklist

- [x] Role-based access control with Permit.io
- [x] Separate permissions for summarizing, reviewing, and viewing content
- [x] Declarative and externalized authorization logic
- [x] Clear separation of roles (admin vs user)
- [x] Mocked AI in place of paid APIs
- [x] In-memory storage for simplicity
- [x] Documented permissions and setup

---

## 📬 Submission Info

- **Challenge**: [AI Access Control Challenge](https://docs.permit.io/dev-challenges/ai-access-control)
- **Developer**: YOUR NAME
- **Hosted App**: (add your frontend/backend links if deployed)
- **Repo**: [GitHub](https://github.com/YOUR_USERNAME/ai-content-assistant)

---

## 📝 License

This project is licensed under the MIT License.
