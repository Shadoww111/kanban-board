# Kanban Board

project management board with workspaces, boards, drag & drop cards, labels, and priorities. built with react + express + mariadb.

## features

- **workspaces** — group related boards, invite members with roles
- **boards** — custom background colors, auto-generated columns
- **columns** — reorder, add/remove, rename
- **cards** — drag & drop between columns, priorities (low/medium/high/urgent), due dates, descriptions
- **labels** — color-coded labels per board, toggle on cards
- **members** — workspace roles (owner, admin, member)
- jwt auth with token expiry handling

## tech stack

| layer | tech |
|-------|------|
| frontend | react 18, vite, tailwind, @hello-pangea/dnd |
| backend | node, express, sequelize |
| database | mariadb 11 |
| auth | jwt + bcrypt |

## setup

```bash
# database
docker-compose up -d

# server
cd server
cp .env.example .env   # edit credentials
npm install
npm run dev

# client (new terminal)
cd client
npm install
npm run dev
```

open http://localhost:5173

## api

### auth
| method | route | description |
|--------|-------|-------------|
| POST | /api/auth/register | register |
| POST | /api/auth/login | login |
| GET | /api/auth/me | current user |
| PUT | /api/auth/me | update profile |

### workspaces
| method | route | description |
|--------|-------|-------------|
| GET | /api/workspaces | list workspaces |
| POST | /api/workspaces | create |
| GET | /api/workspaces/:id | get with boards + members |
| PUT | /api/workspaces/:id | update |
| DELETE | /api/workspaces/:id | delete (owner only) |
| POST | /api/workspaces/:id/members | add member |
| DELETE | /api/workspaces/:id/members/:userId | remove member |

### boards
| method | route | description |
|--------|-------|-------------|
| GET | /api/workspaces/:wsId/boards | list |
| POST | /api/workspaces/:wsId/boards | create (auto columns + labels) |
| GET | /api/workspaces/:wsId/boards/:id | full board with columns + cards |
| DELETE | /api/workspaces/:wsId/boards/:id | delete |

### columns & cards
| method | route | description |
|--------|-------|-------------|
| POST | /api/boards/:id/columns | add column |
| PUT | /api/boards/:id/columns | reorder columns |
| POST | /api/cards | create card |
| PUT | /api/cards/:id | update |
| PUT | /api/cards/:id/move | move to column/position |
| POST | /api/cards/:id/labels/:labelId | toggle label |
| DELETE | /api/cards/:id | delete |

## license

MIT
