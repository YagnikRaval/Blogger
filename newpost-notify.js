let lastPostTitle = "";

async function checkNewPost() {
    const url = "https://www.yagnik.eu.org/feeds/posts/default?alt=json";
    try {
        const response = await fetch(url);
        const data = await response.json();
        const latestPost = data.feed.entry[0];

        if (latestPost && latestPost.title.$t !== lastPostTitle) {
            lastPostTitle = latestPost.title.$t;
            showNotification(latestPost.title.$t, latestPost.link[latestPost.link.length - 1].href);
        }
    } catch (error) {
        console.error("Error fetching latest post:", error);
    }
}

function showNotification(title, link) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification("📢 New Post: " + title, {
            body: "Click to read the latest post!",
            icon: "https://www.yagnik.eu.org/favicon.ico",
        }).onclick = function () {
            window.open(link, "_blank");
        };
    }
}

// Check every 1 minute (60000 ms)
setInterval(checkNewPost, 60000);
