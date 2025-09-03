# ROSAE Theatre Management System

## Overview
A comprehensive theatre management system built with React frontend and Express.js backend. The application manages bookings, customer data, expenses, reviews, staff leave management, and analytics for theatre operations.

## Project Architecture
- **Frontend**: React 18 with Vite build system, Tailwind CSS, and Radix UI components
- **Backend**: Express.js server with session management and RESTful API
- **Database**: SQLite with Drizzle ORM for data management
- **Authentication**: Passport.js with local strategy and session-based auth
- **Build System**: Vite for frontend, esbuild for backend bundling

## Recent Changes
- **2025-01-03**: Configured for Replit environment
  - Updated Vite configuration to allow all hosts (0.0.0.0:5000)
  - Set up development workflow on port 5000
  - Configured autoscale deployment with build and production scripts

## Development Setup
- Port 5000 is used for both development and production
- Server serves both API endpoints and static frontend files
- SQLite database (rosae.db) stores all application data
- Environment variables managed through Replit secrets

## Key Features
- Customer booking management with payment tracking
- Staff leave management system with approval workflows
- Review collection and verification system
- Financial tracking with daily income and expense reports
- Analytics dashboard with revenue goals and ad spend tracking
- Customer ticket management and follow-up system

## Dependencies
- Frontend: React, Vite, Tailwind CSS, Radix UI, React Query
- Backend: Express, Passport, Drizzle ORM, SQLite
- Utilities: date-fns, zod, bcryptjs, jsonwebtoken

## Database Schema
Comprehensive SQLite schema including:
- Users and authentication
- Bookings and payments
- Expenses and financial tracking
- Leave management
- Reviews and feedback
- Analytics and reporting tables