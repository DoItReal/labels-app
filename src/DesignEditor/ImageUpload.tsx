import React, { useState, useRef, useEffect } from 'react';
import { HandleType } from './Interfaces/CommonInterfaces';

const ImageUpload: React.FC = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [editingImage, setEditingImage] = useState<HTMLImageElement | null>(null);
    const [canvasWidth, setCanvasWidth] = useState(600);
    const [canvasHeight, setCanvasHeight] = useState(600);
    const [imgWidth, setImgWidth] = useState(0);
    const [imgHeight, setImgHeight] = useState(0);
    const [resizing, setResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState('');

    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            if (file.size > 5242880) { // 5MB file size limit
                alert('File size exceeds 5MB limit.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

        const handleImageLoad = () => {
            if (imageRef.current) {
                const imageWidth = imageRef.current.width;
                const imageHeight = imageRef.current.height;
                const aspectRatio = imageWidth / imageHeight;
                let newWidth = 0;
                let newHeight = 0;

                if (aspectRatio > 1) {
                    // Image is wider than tall
                    newWidth = canvasWidth;
                    newHeight = newWidth / aspectRatio;
                } else {
                    // Image is taller than wide or square
                    newHeight = canvasHeight;
                    newWidth = newHeight * aspectRatio;
                }
                setImgWidth(newWidth);
                setImgHeight(newHeight);
                setEditingImage(imageRef.current);
            }
        };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (canvasRef.current && editingImage) {
            const rect = canvasRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const clickedResizeHandle = checkResizeHandle(mouseX, mouseY, imgWidth, imgHeight);
            if (clickedResizeHandle) {
                setResizing(true);
                setResizeHandle(clickedResizeHandle);
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (resizing && editingImage && resizeHandle) {
            const offsetX = e.nativeEvent.offsetX;
            const offsetY = e.nativeEvent.offsetY;

            let newWidth = canvasWidth;
            let newHeight = canvasHeight;

            // Calculate the aspect ratio of the image
            const aspectRatio = imgWidth / imgHeight;

            // Calculate the new dimensions based on the aspect ratio
            if (resizeHandle === 'top' || resizeHandle === 'bottom') {
                newWidth = offsetY * aspectRatio;
                newHeight = offsetY;
            } else if (resizeHandle === 'left' || resizeHandle === 'right') {
                newWidth = offsetX;
                newHeight = offsetX / aspectRatio;
            } else if (resizeHandle === 'top-left' || resizeHandle === 'bottom-right') {
                newWidth = Math.min(offsetX, offsetY * aspectRatio);
                newHeight = newWidth / aspectRatio;
            } else if (resizeHandle === 'top-right' || resizeHandle === 'bottom-left') {
                newWidth = Math.min(offsetY * aspectRatio, canvasWidth - offsetX);
                newHeight = newWidth / aspectRatio;
            }
            setImgWidth(newWidth);
            setImgHeight(newHeight);
        }
    };
    /*
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (resizing && editingImage && resizeHandle) {
            const offsetX = e.nativeEvent.offsetX;
            const offsetY = e.nativeEvent.offsetY;
            const newWidth = offsetX;
            const newHeight = offsetY;
            setCanvasWidth(newWidth);
            setCanvasHeight(newHeight);
        }
    };
    */
    const handleMouseUp = () => {
        setResizing(false);
        setResizeHandle('');
    };

    const handleCancel = () => {
        setImagePreview(null);
        setEditingImage(null);
        setCanvasWidth(600);
        setCanvasHeight(600);
    };

    const handleSave = () => {
        if (canvasRef.current) {
            setCanvasHeight(imgHeight);
            setCanvasWidth(imgWidth);
            const canvas = canvasRef.current;
            const dataURL = canvas.toDataURL(); // Get base64 encoded image data
            console.log(dataURL); // Log the base64 encoded image data

            // Calculate the size of the base64 encoded image data in MB
            const sizeInBytes = (dataURL.length * (3 / 4)) - 2;
            const sizeInMB = sizeInBytes / (1024 * 1024);
            console.log('Size of image:', sizeInMB.toFixed(2), 'MB');
            
        }
    };
    const checkResizeHandle = (
    mouseX: number,
    mouseY: number,
    imgWidth: number,
    imgHeight: number
): HandleType | null => {
    // Define the positions of resize handles relative to the canvas
    const handles = {
        'top-left': [0, 0],
        'top-right': [imgWidth, 0],
        'bottom-right': [imgWidth, imgHeight],
        'bottom-left': [0, imgHeight],
        'top': [imgWidth / 2, 0],
        'right': [imgWidth, imgHeight / 2],
        'bottom': [imgWidth / 2, imgHeight],
        'left': [0, imgHeight / 2],
        'null': [0, 0], // Default for no handle
    } as const;
    // Iterate through the handles and check if the mouse position is within the handle area
    for (const handle of Object.keys(handles) as HandleType[]) {
        if (handle === null) continue; // Skip the null handle in iteration
        const [handleX, handleY] = handles[handle];
        if (
            mouseX >= handleX - 4 &&
            mouseX <= handleX + 4 &&
            mouseY >= handleY - 4 &&
            mouseY <= handleY + 4
        ) {
            return handle;
        }
    }

    return null;
};
    useEffect(() => {
        if (editingImage) {
            
            let newWidth = imgWidth;
            let newHeight = imgHeight;

            // Calculate new dimensions based on proportions
            if (newWidth > 600 || newHeight > 600) {
                const aspectRatio = newWidth / newHeight;
                if (newWidth > newHeight) {
                    newWidth = 600;
                    newHeight = newWidth / aspectRatio;
                } else {
                    newHeight = 600;
                    newWidth = newHeight * aspectRatio;
                }
            }
            setImgWidth(newWidth);
            setImgHeight(newHeight);
      
        }
    }, [editingImage]);
    useEffect(() => {
        if (canvasRef.current && editingImage) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(editingImage, 0, 0, imgWidth, imgHeight);

                // Draw resize handles for top, bottom, left, right, and corners
                const handleSize = 8; // Increase handle size for better interaction
                const handles = [
                    { x: imgWidth / 2 - handleSize / 2, y: 0 }, // top
                    { x: imgWidth / 2 - handleSize / 2, y: imgHeight - handleSize }, // bottom
                    { x: 0, y: imgHeight / 2 - handleSize / 2 }, // left
                    { x: imgWidth - handleSize, y: imgHeight / 2 - handleSize / 2 }, // right
                    { x: 0, y: 0 }, // top-left
                    { x: imgWidth - handleSize, y: 0 }, // top-right
                    { x: 0, y: imgHeight - handleSize }, // bottom-left
                    { x: imgWidth - handleSize, y: imgHeight - handleSize } // bottom-right
                ];

                ctx.fillStyle = 'red';
                handles.forEach(handle => {
                    ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
                });
            }
        }
    }, [editingImage, imgWidth, imgHeight, canvasWidth, canvasHeight]);

    return (
         <div>
            {!editingImage ? (<input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />) : null}
            {imagePreview && (
                <div>
                    {/* Load image and set the image element's onLoad handler */}
                    <img
                        ref={imageRef}
                        src={imagePreview}
                        alt="Uploaded"
                        onLoad={handleImageLoad}
                        style={{ display: 'none' }} // Hide the image element
                    />
                    {/* Render canvas when image is loaded */}
                    {editingImage && (
                        <canvas
                            ref={canvasRef}
                            width={canvasWidth}
                            height={canvasHeight}
                            style={{ border: '1px solid black', cursor: resizing ? 'grabbing' : 'auto' }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                        >
                            Your browser does not support the HTML canvas element.
                        </canvas>
                    )}
                    <button onClick={handleCancel}>Cancel</button>
                    <button onClick={handleSave}>Save</button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
