// Command to execute formatting (bold, italic, etc.)
function execCmd(command, value = null) {
    document.execCommand(command, false, value);
}

// Function to generate Table of Contents (TOC)
function generateTOC(content) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const headers = tempDiv.querySelectorAll('h1, h2, h3, h4');
    let tocHTML = '<div class="toc"><h2>Table of Contents</h2><ul>';

    headers.forEach((header, index) => {
        const headerText = header.innerText;
        const headerId = `header-${index}`;
        header.id = headerId; // Assign unique IDs to headers
        tocHTML += `<li><a href="#${headerId}">${headerText}</a></li>`; // Add anchor links to TOC
    });

    tocHTML += '</ul></div>';
    return tocHTML + tempDiv.innerHTML;
}

// Function to save the blog post and display the HTML in the text area
function savePost() {
    const title = prompt("Enter the title of your blog post:");
    let content = document.getElementById('editor').innerHTML;

    // Generate TOC based on headings in the content
    content = generateTOC(content);

    // Generate the HTML content for the blog post with TOC
    const newPostHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="../style.css">
        <title>${title}</title>
    </head>
    <body>
        <h1>${title}</h1>
        ${content}
    </body>
    </html>
    `;

    // Display the HTML in the textarea for manual copying
    const htmlOutput = document.getElementById('htmlOutput');
    htmlOutput.value = newPostHTML;

    // Display a preview
    const preview = document.getElementById('preview');
    preview.innerHTML = content;

    // Optionally, open the preview in a new window
    const win = window.open();
    win.document.write(newPostHTML);
    win.document.close();
}

// Function to insert an image into the editor
function insertImage() {
    const imageUrl = prompt('Enter the image URL:', 'http://');
    if (imageUrl) {
        document.execCommand('insertImage', false, imageUrl);
    }
}

// Function to insert a video into the editor
function insertVideo() {
    const videoUrl = prompt('Enter the video URL (YouTube or Vimeo):', 'http://');
    if (videoUrl) {
        const videoEmbed = `<iframe width="560" height="315" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`;
        document.execCommand('insertHTML', false, videoEmbed); // Use execCommand to insert iframe
    }
}

// Load saved content from localStorage on page load
window.onload = function() {
    const savedContent = localStorage.getItem('blogPost');
    if (savedContent) {
        document.getElementById('preview').innerHTML = savedContent;
    }
};

// Function to auto-resize the editor
function autoResizeEditor() {
    const editor = document.getElementById('editor');
    editor.style.height = 'auto'; // Reset the height to auto to calculate the new height
    editor.style.height = editor.scrollHeight + 'px'; // Set the height to the scroll height
}

// Add an event listener to the editor for input events
document.getElementById('editor').addEventListener('input', autoResizeEditor);
