# PostgreSQL Setup Guide for SkoolCeria

Since you haven't set up the database connection yet, follow these steps to create the database and user.

## Option 1: Using pgAdmin (GUI)
1.  Open **pgAdmin** (installed with PostgreSQL).
2.  Expand **Servers** -> **PostgreSQL**.
3.  Right-click **Login/Group Roles** -> **Create** -> **Login/Group Role**.
    -   **Name**: `skoolceria_user`
    -   **Definition** tab -> **Password**: `password123` (or your choice)
    -   **Privileges** tab -> Enable **Can login?** and **Superuser** (for development ease).
    -   Click **Save**.
4.  Right-click **Databases** -> **Create** -> **Database**.
    -   **Database**: `skoolceria`
    -   **Owner**: `skoolceria_user`
    -   Click **Save**.

## Option 2: Using Command Line (psql)
If you have `psql` installed and added to your PATH, run these commands in your terminal:

1.  Connect to the default postgres database:
    ```powershell
    psql -U postgres
    ```
    *(Enter your postgres installation password if prompted)*

2.  Run the following SQL commands:
    ```sql
    CREATE USER skoolceria_user WITH PASSWORD 'password123';
    CREATE DATABASE skoolceria OWNER skoolceria_user;
    GRANT ALL PRIVILEGES ON DATABASE skoolceria TO skoolceria_user;
    \q
    ```

## Update Environment Variables
Once created, create a `.env` file in `c:\Users\lenovo\skoolCeria\backend\.env` with:

```env
DB_USER=skoolceria_user
DB_PASSWORD=password123
DB_NAME=skoolceria
DB_HOST=localhost
DB_PORT=5432
```
