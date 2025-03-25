import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Bold,
    Italic,
    Strikethrough,
    Underline,
    Essentials,
    FontColor,
    FontSize,
    Heading,
    Image,
    ImageResize,
    ImageToolbar,
    ImageUpload,
    Link,
    List,
    Paragraph,
    Table,
    TableToolbar,
    Undo,
    Highlight,
    Code,
    BlockQuote,
    MediaEmbed,
    SimpleUploadAdapter
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

// For a GPL build, you may or may not need to specify a license key.
// If your build requires one, ensure it’s valid.
const LICENSE_KEY = 'GPL';

export default function Editor({ props }) {
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useEffect(() => {
        setIsLayoutReady(true);
        return () => setIsLayoutReady(false);
    }, []);

    const editorConfig = useMemo(() => {
        if (!isLayoutReady) return {};

        return {
            toolbar: {
                items: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'underline',
                    'strikethrough',
                    'highlight',
                    'fontSize',
                    'fontColor',
                    '|',
                    'link',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'insertImage',
                    'insertTable',
                    'mediaEmbed',
                    '|',
                    'code',
                    'blockQuote',
                    '|',
                    'undo',
                    'redo'
                ]
            },
            plugins: [
                Essentials,
                Bold,
                Italic,
                Underline,
                Strikethrough,
                Highlight,
                FontColor,
                FontSize,
                Heading,
                Image,
                ImageResize,
                ImageToolbar,
                ImageUpload,
                Link,
                List,
                Paragraph,
                Table,
                TableToolbar,
                Undo,
                Code,
                BlockQuote,
                MediaEmbed,
                SimpleUploadAdapter
            ],
            image: {
                toolbar: [
                    'imageTextAlternative',
                    '|',
                    'imageStyle:inline',
                    'imageStyle:block',
                    '|',
                    'resizeImage'
                ]
            },
            table: {
                contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
            },
            simpleUpload: {
                uploadUrl: '/upload',
            },
            placeholder: 'Start writing...',
            licenseKey: LICENSE_KEY
        };
    }, [isLayoutReady]);

    // Removed the effect that updates editor content on props.initialData changes.
    // Use the `data` prop to set the initial content on mount.
    // This prevents re-setting the editor’s data during user input.

    return (
        <div  className="editor-wrapper text-black" ref={editorContainerRef}>
            {isLayoutReady && (
                <CKEditor 
                    editor={ClassicEditor}
                    config={editorConfig}
                    data={props.initialData} // Set initial content only once.
                    onReady={(editor) => {
                        editorRef.current = editor;
                    }}
                    onChange={(event, editor) => {
                        if (props.onChange) {
                            props.onChange(event, editor);
                        }
                    }}
                />
            )}
        </div>
    );
}
