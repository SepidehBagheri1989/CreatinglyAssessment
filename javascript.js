//Threshold Definition
let visibleThreshold = 0.5; // Initialize visible threshold value
let loadMoreThreshold = 100; // Initial  threshold value
let currentPage = 1;


/* Dynamically adjusts the visibility and load more thresholds
 based on the screen size whenever the window is resized.*/

//Dynamic Adjustment
function adjustThresholds() {
    // Adjust thresholds based on screen size or user interaction patterns
    const screenWidth = window.innerWidth;

    if (screenWidth <= 600) {
        // Small screens
        visibleThreshold = 0.3; //If at least 30% of an item is visible in the viewport, consider it visible.
        loadMoreThreshold = 50;
    } else if (screenWidth <= 1024) {
        // Medium screens
        visibleThreshold = 0.5;
        loadMoreThreshold = 100;
    } else {
        // Large screens
        visibleThreshold = 0.7;
        loadMoreThreshold = 150;
    }
}

/*
Fetches additional posts from a mock API (https://jsonplaceholder.typicode.com/posts)
 and appends them to the page when the user scrolls near the bottom.
*/

//Efficient Data Loading
async function loadMoreData() {
    try {
        adjustThresholds(); // Adjust thresholds before loading more data

        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=15`);
        const newPosts = await response.json();

        newPosts.forEach(post => {
            const newPost = document.createElement('div');
            newPost.classList.add('post');
            newPost.innerText = `Post ${post.id}: ${post.title}`;
            document.getElementById('postContainer').appendChild(newPost);
        });

        currentPage++;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

//For Visibility Calculation
function calculateVisibility(post) {
    const rect = post.getBoundingClientRect();  //A DOMRect object with eight properties:
                                                //left, top, right, bottom, x, y, width, height.
    const windowHeight = window.innerHeight;

    // Calculate the percentage of the post visible in the viewport
    const topVisible = Math.max(0, rect.top);
    const bottomVisible = Math.min(rect.bottom, windowHeight);
    const visibleHeight = bottomVisible - topVisible;
    const visibilityRatio = visibleHeight / rect.height;

    return visibilityRatio;
}

/* Adjusts the opacity of posts based on their visibility in the view. */

function checkVisibility() {
    const posts = document.querySelectorAll('.post');

    posts.forEach(post => {
        const visibility = calculateVisibility(post);

        if (visibility > visibleThreshold) {
            // Post is visible
            post.style.opacity = '1';
        } else {
            // Post is not visible
            post.style.opacity = '0';
        }
    });
}

/* Triggers the visibility check and loads more data when the user scrolls near the bottom of the page. */

function handleScroll() {
    checkVisibility();

    // Load more data when nearing the bottom
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - loadMoreThreshold) {
        loadMoreData();
    }
}

/* Listens for scroll and resize events to dynamically adjust thresholds and trigger relevant actions. */
//Viewport Monitoring
document.addEventListener('DOMContentLoaded', () => {
    loadMoreData(); // Initial data load

    window.addEventListener('scroll', handleScroll); // Event listener for scrolling
    window.addEventListener('resize', adjustThresholds); // Adjust thresholds on window resize

    setInterval(checkVisibility, 1000); // Repeat the visibility check after a delay (adjust as needed)
});