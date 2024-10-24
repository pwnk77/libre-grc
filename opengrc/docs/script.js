document.addEventListener('DOMContentLoaded', () => {
    const markdownFiles = {
        'landing-content': 'landing_page.md'
    };

    const loadMarkdownContent = async (elementId, fileName) => {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element with id '${elementId}' not found. Skipping content load.`);
            return;
        }

        try {
            const response = await fetch(fileName.toLowerCase());
            const text = await response.text();
            // Enable GitHub Flavored Markdown
            marked.setOptions({
                gfm: true,
                breaks: true
            });
            const content = marked.parse(text);
            if (content.trim()) {
                element.innerHTML = content;
            }
        } catch (error) {
            console.error(`Error loading ${fileName}:`, error);
        }
    };

    Object.entries(markdownFiles).forEach(([elementId, fileName]) => {
        loadMarkdownContent(elementId, fileName);
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            } else {
                console.warn(`Target element with id '${targetId}' not found.`);
            }
        });
    });
});
