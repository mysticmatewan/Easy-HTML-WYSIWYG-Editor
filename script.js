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

// Function to save the html post and display the HTML in the text area
function savePost() {
    const title = prompt("Enter the title of your HTML post:");
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
        <link rel="stylesheet" href="style.css">
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

// Function to insert a new paragraph when Enter is pressed
function handleEditorInput(event) {
    const editor = document.getElementById('editor');

    // Check if the Enter key is pressed
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default behavior (e.g., adding a newline)

        // Get the current selection
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        
        // Create a new paragraph element
        const newParagraph = document.createElement('p');
        newParagraph.innerText = ''; // Start with empty text

        // Insert the new paragraph at the cursor's position
        range.deleteContents(); // Clear the selection if any
        range.insertNode(newParagraph);
        
        // Move the cursor to the new paragraph
        range.setStartAfter(newParagraph);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        // Trigger the auto-resize function
        autoResizeEditor();
    }
}

// Add event listeners for input and keydown
const editor = document.getElementById('editor');
editor.addEventListener('input', autoResizeEditor);
editor.addEventListener('keydown', handleEditorInput);

// Function to handle pasting HTML content
editor.addEventListener('paste', function(event) {
    event.preventDefault(); // Prevent default paste behavior
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text/html') || clipboardData.getData('text/plain');
    
    // Create a temporary div to parse the pasted content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = pastedData;

    // Wrap all text nodes in <p> elements
    const paragraphs = tempDiv.querySelectorAll('p');
    paragraphs.forEach(p => {
        const newP = document.createElement('p');
        newP.innerHTML = p.innerHTML; // Retain inner HTML of the pasted content
        tempDiv.appendChild(newP);
    });

    // Insert the modified content at the cursor's position
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    range.deleteContents(); // Clear the selection if any
    range.insertNode(tempDiv);

    // Move the cursor to the end of the newly inserted content
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);

    // Trigger the auto-resize function
    autoResizeEditor();
});



