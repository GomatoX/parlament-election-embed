# LRT Election app

## Overview

This document provides instructions for building and deploying the LRT Election app, which fetches data from VRK (the Central Electoral Commission of Lithuania) via the LRT API.

## VRK Documentation

For detailed API documentation from VRK, refer to the following link:
VRK API Documentation.

## Data Source and Caching

All data retrieved from VRK is proxied through LRT's API at:
https://api2.lrt.lt/vrk/clasificators?url=.
Please note, the API response is cached for 2 minutes.

---

## LRT Mobile App

### Handling Missing Data

There may be issues fetching certain data from VRK, such as missing images. To handle this, you can generate an embed without images by modifying the .env file. Set the VITE_APP_BUILD variable to "true".

---

## Getting Started

To set up the development environment:

1. **Development Server**  
   Run the following command to start the development server:

   ```bash
   yarn dev
   ```

   This will launch the app at http://localhost:5173/.

2. **Building for Production**  
   Use the following command to build the app for production:

   ```bash
   yarn build
   ```

   The build will be output to the `dist/` directory.

3. **Post-Build Step**  
   After building, a postbuild script will run automatically, generating a boot.js file. This file should be included in the desired location.

## Building and Deployment

1. **Update the .env file**  
   Modify the following variables to correspond to the correct election round:

   - `VITE_ELECTION_TOUR_ONE_ID`: Set this for the first election round.

   - `VITE_ELECTION_TOUR_TWO_ID`: Set this for the second election round.
     Example:
     The most recent election was the first round of the 2024 elections with an ID of `1544/1/2150`.

2. **Set the Base URL**  
   Update the `VITE_BASE_URL` variable to specify where the application will be hosted (this is for serving assets).

3. **Build the Project**  
   Run the build command:

   ```bash
   yarn build
   ```

   The required files will be generated and stored in the dist/ directory.

4. **Deployment**  
   Copy the contents of the dist/ directory and deploy them to the preferred location.

## Election Tour Differences

Be mindful of potential differences between election rounds. Before publishing, always verify that the data is accurate.

Additionally, depending on the election round, you may need to adjust the order of the `Tab` items in the app. These adjustments can be made in the `src/index.ts` file.
