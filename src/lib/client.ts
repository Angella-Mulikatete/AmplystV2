import { ApifyClient } from 'apify-client';

// Initialize the ApifyClient with your Apify API token
// Replace the '<YOUR_API_TOKEN>' with your token
const client = new ApifyClient({
    token: 'apify_api_7duCuWXWiRN2DJNi5aEVSalzmMhEc12ijzrz',
});

// Prepare Actor input
const input = {
    "profiles": [
        "apifyoffice"
    ]
};

// Run the Actor and wait for it to finish
const run = await client.actor("clockworks/tiktok-profile-scraper").call(input);

// Fetch and print Actor results from the run's dataset (if any)
console.log('Results from dataset');
console.log(`💾 Check your data here: https://console.apify.com/storage/datasets/${run.defaultDatasetId}`);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
items.forEach((item) => {
    console.dir(item);
});

