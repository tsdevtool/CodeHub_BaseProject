// SimpleCodeEditor.jsx
import React, { useEffect, useRef } from 'react';

// Helper to escape HTML special characters
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// Basic syntax highlighter (customize as needed based on language)
function highlightSyntax(code) {
    let html = escapeHtml(code);

    // Highlight strings (single/double quotes)
    html = html.replace(
        /(".*?"|'.*?')/g,
        '<span class=\'text-green-400\'>$1</span>'
    );


    // Class/constructor keywords
    const keywords2 = ['extends', 'constructor', 'static', 'super', 'new', 'this'];
    const keywords2Regex = new RegExp(`\\b(${keywords2.join('|')})\\b`, 'g');
    html = html.replace(keywords2Regex, '<span class=\'text-yellow-400\'>$1</span>');

    // Highlight JavaScript keywords
    const keywords = ['const', 'let', 'var', 'if', 'else', 'return', 'function', 'import', 'from', 'export', 'default'];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    html = html.replace(keywordRegex, '<span class=\'text-purple-400\'>$1</span>');

    // Highlight JavaScript keywords
    const Booleans = ['true', 'false'];
    const BooleansRegex = new RegExp(`\\b(${Booleans.join('|')})\\b`, 'g');
    html = html.replace(BooleansRegex, '<span class=\'text-orange-400\'>$1</span>');

    // Loop & control keywords
    const loopKeywords = ['for', 'while', 'do', 'break', 'continue', 'switch', 'case'];
    const loopRegex = new RegExp(`\\b(${loopKeywords.join('|')})\\b`, 'g');
    html = html.replace(loopRegex, `<span class=\'text-red-400\'>$1</span>`);

    // Error handling keywords
    const errorKeywords = ['try', 'catch', 'finally', 'throw'];
    const errorRegex = new RegExp(`\\b(${errorKeywords.join('|')})\\b`, 'g');
    html = html.replace(errorRegex, `<span class=\'text-pink-400\'>$1</span>`);

    // Advanced keywords
    const advancedKeywords = ['delete', 'typeof', 'instanceof', 'in', 'of', 'await', 'async', 'yield'];
    const advancedRegex = new RegExp(`\\b(${advancedKeywords.join('|')})\\b`, 'g');
    html = html.replace(advancedRegex, `<span class='text-indigo-400'>$1</span>`);

    // Highlight single-line comments
    html = html.replace(/(\/\/.*$)/gm, '<span class=\'text-gray-500\'>$1</span>');

    return html;
}

const CodeEditor = ({
    defaultLanguage,    // not used for highlighting here, but you can extend it as needed
    defaultValue,
    onMount,
    value,
    onChange,
    placeholder,
}) => {
    // Use the controlled value or fallback to defaultValue if undefined
    const codeValue = value !== undefined ? value : defaultValue || "";
    const textareaRef = useRef(null);
    const preRef = useRef(null);

    // Call onMount (if provided) with a simple editor API.
    useEffect(() => {
        if (onMount && textareaRef.current) {
            const fakeEditor = {
                getValue: () => textareaRef.current.value,
            };
            onMount(fakeEditor);
        }
    }, [onMount]);

    // Synchronize scroll positions between the textarea and the highlighted code (the <pre> element).
    const handleScroll = (e) => {
        if (preRef.current) {
            preRef.current.scrollTop = e.target.scrollTop;
            preRef.current.scrollLeft = e.target.scrollLeft;
        }
    };

    return (
        <div className="relative w-full h-[50vh]">
            {/* Highlighted code displayed beneath the textarea */}
            <pre
                ref={preRef}
                className="absolute inset-0 overflow-auto whitespace-pre-wrap p-2 font-mono text-sm bg-gray-900 text-white"
            >
                <code
                    dangerouslySetInnerHTML={{ __html: highlightSyntax(codeValue) + "\n" }}
                />
            </pre>
            {/* Transparent textarea for input */}
            <textarea
                ref={textareaRef}
                value={codeValue}
                onChange={(e) => onChange(e.target.value)}
                onScroll={handleScroll}
                placeholder={placeholder || "Type your code here..."}
                className="absolute inset-0 w-full h-full p-2 font-mono text-sm bg-transparent text-transparent caret-white overflow-auto resize-none"
                style={{ zIndex: 10 }}
                spellCheck="false"
            />
        </div>
    );
};

export default CodeEditor;
