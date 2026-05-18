#!/bin/bash

# Smart Apartment IoT Dashboard - Quick Start Script

set -e

echo "🚀 Smart Apartment IoT Dashboard - Starting..."
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose found"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🐳 Starting Docker services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ All services started!"
echo ""
echo "🌐 Access the application:"
echo "   Dashboard:  http://localhost:5173"
echo "   API Docs:   http://localhost:8000/docs"
echo "   PgAdmin:    http://localhost:5050"
echo ""
echo "📝 Credentials:"
echo "   PgAdmin Email:    admin@smartapt.com"
echo "   PgAdmin Password: admin123"
echo "   Database User:    smartapt"
echo "   Database Pass:    smartapt123"
echo ""
echo "📖 For more information, see SETUP.md"
echo ""
echo "💡 Useful commands:"
echo "   View logs:        docker-compose logs -f"
echo "   Stop services:    docker-compose stop"
echo "   Restart services: docker-compose restart"
echo "   Remove services:  docker-compose down"
echo ""
