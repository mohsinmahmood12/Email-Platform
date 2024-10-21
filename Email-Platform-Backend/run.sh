#!/bin/bash

# Function to remove __pycache__ directories and .pyc files
remove_pycache() {
    echo "Removing __pycache__ directories..."
    find . -name __pycache__ -type d -exec rm -r {} +
    echo "Removing .pyc files..."
    find . -name "*.pyc" -type f -delete
}

# Function to run uvicorn with 0.0.0.0 host
run_uvicorn_external() {
    uvicorn main:app --host 0.0.0.0 --port 8000
}

# Function to run uvicorn with localhost
run_uvicorn_local() {
    uvicorn main:app --host localhost --port 8000 --reload
}

# Function to generate migrations
generate_migrations() {
    echo "Generating migrations..."
    alembic revision --autogenerate -m "Auto-generated migration"
}

# Function to apply migrations
apply_migrations() {
    echo "Applying migrations..."
    alembic upgrade head
}

# Check the passed argument
case $1 in
    cleanup)
        remove_pycache
        ;;
    run_external)
        run_uvicorn_external
        ;;
    run_local)
        run_uvicorn_local
        ;;
    generate_migrations)
        generate_migrations
        ;;
    apply_migrations)
        apply_migrations
        ;;
    *)
        echo "Invalid argument. Available arguments: cleanup, run_external, run_local, generate_migrations, apply_migrations"
        ;;
esac
