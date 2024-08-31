# Flux - A MERN Stack Music Streaming Application

Flux is a full-featured music streaming application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides users with an intuitive interface to browse, play, and manage their music libraries, including the creation of playlists.

## Features

-   **Music Streaming:** Seamless playback with high-quality audio.
-   **Playlist Management:** Create, manage, and organize your playlists.
-   **User Authentication:** Secure login and registration using JWT.
-   **Responsive Design:** Optimized for different screen sizes.
-   **Cloudinary Integration:** Handles media uploads efficiently.
-   **Custom UI:** Built with Tailwind CSS for a vibrant and user-friendly interface.

## Project Structure

```
flux/
│
├── backend/
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── utils/             # Utility functions
│   ├── .env               # Environment variables (Not included in Git)
│   ├── .gitignore         # Files and folders to ignore in Git
│   ├── index.js           # Entry point for the backend server
│   ├── package.json       # Backend dependencies and scripts
│   └── package-lock.json  # Backend lock file
│
├── frontend/
│   ├── node_modules/      # Frontend dependencies
│   ├── public/            # Public files
│   ├── src/               # React components and pages
│   ├── .env               # Environment variables (Not included in Git)
│   ├── .eslintrc.cjs      # ESLint configuration
│   ├── .gitignore         # Files and folders to ignore in Git
│   ├── index.html         # Main HTML file
│   ├── package.json       # Frontend dependencies and scripts
│   ├── package-lock.json  # Frontend lock file
│   ├── postcss.config.js  # PostCSS configuration
│   ├── README.md          # Project documentation
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── vercel.json        # Vercel deployment configuration
│   └── vite.config.js     # Vite configuration
```

## Installation and Setup

### Prerequisites

Make sure you have the following installed:

-   **Node.js:** [Install Node.js](https://nodejs.org/)
-   **npm:** Comes with Node.js. Alternatively, you can use [Yarn](https://yarnpkg.com/) as a package manager.
-   **MongoDB Atlas:** [Setup MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for the database.

### Clone the Repository

```bash
git clone https://github.com/your-username/flux.git
cd flux
```

### Backend Setup

1. Navigate to the `backend` directory:

    ```bash
    cd backend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `backend` directory with the following variables:

    ```env
    PORT=5000                 # Port for the backend server
    DB=mongodb://...          # MongoDB connection string
    KEY=your_secret_jwt_key   # JWT secret key
    ```

4. Run the backend server:

    ```bash
    npm start
    ```

    The backend server will start on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the `frontend` directory:

    ```bash
    cd ../frontend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `frontend` directory with the following variables:

    ```env
    VITE_BACKEND_URL=http://localhost:5000  # Backend server URL
    VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
    VITE_CLOUDINARY_KEY=your_cloudinary_api_key
    ```

4. Run the frontend development server:

    ```bash
    npm run dev
    ```

### Deployment

Flux is configured to be deployed using:

-   **Frontend:** Vercel
-   **Backend:** Render
-   **Database:** MongoDB Atlas

## Contributing

Feel free to fork this repository, make your changes, and submit a pull request. Please make sure to follow the coding standards and include appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

-   Special thanks to everyone who contributed to this project.
-   Built using the MERN stack, Tailwind CSS, and Vite for optimal performance and scalability.

---
