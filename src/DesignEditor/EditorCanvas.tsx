import React, { useEffect, useRef, useState } from 'react';
import { textParametersMap } from './Editor'; // Import the Design type
import { Position, Dimensions, TtextParameter, TimageParameter, textParameters, textFieldBlock, imageFieldBlock, allergenFieldBlock, UnifiedBlock, isUnifiedBlock, isDesign, isDesignArray, Design, NewDesign, HandleType } from './Interfaces/CommonInterfaces';
import { styled } from '@mui/system';

const StyledCanvas = styled('canvas')`
  border: 1px solid #000;
  margin-bottom: 10px;
`;
interface CanvasProps {
    dimensions: Dimensions;
    border: number;
    blocks: UnifiedBlock[];
    selectedBlock: UnifiedBlock | null;
    setSelectedBlock: React.Dispatch<React.SetStateAction<UnifiedBlock | null>>;
    setBlocks: React.Dispatch<React.SetStateAction<UnifiedBlock[]>>;
    deleteSelectedBlock: () => void;
  //  selectedTextParameter: TtextParameter; // Add selectedTextParameter
    
}

const Canvas: React.FC<CanvasProps> = ({ dimensions,border, blocks, selectedBlock, setSelectedBlock, setBlocks, deleteSelectedBlock }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<Position | null>(null);
    const [resizeHandle, setResizeHandle] = useState<HandleType | null>(null);
    const animationRef = useRef<number>();

    // Draw the blocks on canvas load
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;
        // Add event listener for delete key press
        window.addEventListener('keydown', handleDeleteKeyPress);
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Draw the blocks
        drawDesigns();
        return () => {
            window.removeEventListener('keydown', handleDeleteKeyPress);
        };
    }, [canvasRef, blocks,dimensions, selectedBlock, setBlocks, setSelectedBlock]);

    // Delete the selected design on delete key press
    const handleDeleteKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Delete' && selectedBlock) {
            deleteSelectedBlock();
        }
    };
    // Handle mouse down event
    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        let clientX, clientY;
        if ('touches' in event) {
            // For touch events
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            // For mouse events
            clientX = event.clientX;
            clientY = event.clientY;
        }
        const rect = canvasRef.current?.getBoundingClientRect();
        const mouseX = clientX - (rect?.left || 0);
        const mouseY = clientY - (rect?.top || 0);

        const clickedDesign = blocks.find((design) => {
            const clickedHandle = checkResizeHandle(mouseX, mouseY, design);
            if (clickedHandle) {
                setResizeHandle(clickedHandle);
                setIsDragging(false);
                setDragStart(null);
                return true; // Stop further processing, we're in resize mode
            }

            //convert to PX from % 
            const x = design.position.x * dimensions.width / 100;
            const y = design.position.y * dimensions.height / 100;
            const width = design.dimensions.width * dimensions.width / 100;
            const height = design.dimensions.height * dimensions.height / 100;
            return (
                mouseX >= x &&
                mouseX <= x  + width &&
                mouseY >= y &&
                mouseY <= y + height
            );
        });

        if (clickedDesign) {
            setIsDragging(true);
            setDragStart({ x: mouseX - clickedDesign.position.x*dimensions.width/100, y: mouseY - clickedDesign.position.y*dimensions.height/100 });
            setSelectedBlock(clickedDesign);
        } else {
            // If no object is clicked, deselect the selected object
            setSelectedBlock(null);
        }
    };
    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        // Draw the blocks on every mouse move
        animationRef.current = requestAnimationFrame(() => {
             drawDesigns();
        });
        let clientX, clientY;
        // Get the mouse position
        if ('touches' in event) {
            // For touch events
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            // For mouse events
            clientX = event.clientX;
            clientY = event.clientY;
        }
        // Check if the mouse is on a resize handle
        if ((isDragging || resizeHandle) && selectedBlock && dragStart !== null) {
            // Get the mouse position relative to the canvas
            const rect = canvasRef.current?.getBoundingClientRect();
            const mouseX = clientX - (rect?.left || 0);
            const mouseY = clientY - (rect?.top || 0);

            // Update the design position
            setBlocks((prevDesigns) =>
                prevDesigns.map((prevDesign) => {
                    // Check if the design is the selected design
                    if (prevDesign.id === selectedBlock.id) {
                        //const { x, y } = prevDesign.position;
                        //converting to PX from %
                        const x = prevDesign.position.x * dimensions.width / 100;
                        const y = prevDesign.position.y * dimensions.height / 100;
                        const width = prevDesign.dimensions.width * dimensions.width / 100;
                        const height = prevDesign.dimensions.height * dimensions.height / 100;

                        let newWidth = width;
                        let newHeight = height;
                        let newX = x;
                        let newY = y;

                        // Check if the design is being resized or dragged
                        if (resizeHandle) {
                            // Check for side handles
                            if (resizeHandle.includes('right')) {
                                newWidth = mouseX - x;
                            } else if (resizeHandle.includes('left')) {
                                newWidth = x + width - mouseX;
                                newX = mouseX;
                            }
                            // Check for top/bottom handles
                            if (resizeHandle.includes('bottom')) {
                                newHeight = mouseY - y;
                            } else if (resizeHandle.includes('top')) {
                                newHeight = (y + height - mouseY);
                                newY = mouseY;
                            }

                            // Check for corner handles
                            if (resizeHandle === 'top-left') {
                                newX = mouseX;
                                newY = mouseY;
                                newWidth = x + width - mouseX;
                                newHeight = y + height - mouseY;
                            } else if (resizeHandle === 'top-right') {
                                newY = mouseY;
                                newWidth = mouseX - x;
                                newHeight = y + height - mouseY;
                            } else if (resizeHandle === 'bottom-left') {
                                newX = mouseX;
                                newWidth = x + width - mouseX;
                                newHeight = mouseY - y;
                            } else if (resizeHandle === 'bottom-right') {
                                newWidth = mouseX - x;
                                newHeight = mouseY - y;
                            }
                        } else {
                            // If no resize handle, treat it as dragging
                            newX = mouseX - dragStart.x;
                            newY = mouseY - dragStart.y;
                        }
                        //check if the design is not too small and adjust accordingly and dont move the design if it is not dragged
                        if (newWidth < 10) newWidth = 10;
                        if (newHeight < 10) newHeight = 10;
                        if (newWidth === 10 && resizeHandle) newX =  x;
                        if (newHeight === 10 && resizeHandle) newY = y;

 
                        //check if the design is within the canvas boundaries and adjust accordingly and dont move the opposite border if its on minimum size
                        if (newX < 0) newX = 0;         
                        if (newY < 0) newY = 0;
                        if (newX + newWidth > dimensions.width) newX = dimensions.width - newWidth;
                        if (newY + newHeight > dimensions.height) newY = dimensions.height - newHeight;

                        return {
                            ...prevDesign,
                            position: {
                                x: Math.trunc(newX*10000/dimensions.width)/100,
                                y: Math.trunc(newY*10000/dimensions.height)/100,
                            },
                            dimensions: {
                                //converting back to % from PX 
                                width: Math.trunc(newWidth * 10000 / dimensions.width)/100,
                                height: Math.trunc(newHeight*10000/dimensions.height)/100,
                            },
                        };
                    }
                    return prevDesign;
                })
            );
        }
    };

    // Cancel all animations when mouse is up 
    const handleMouseUp = () => {
        setIsDragging(false);
        setDragStart(null);
        setResizeHandle(null);
    };

    // Check if the mouse is on a resize handle
    const checkResizeHandle = (
        mouseX: number,
        mouseY: number,
        design: UnifiedBlock | undefined
    ): HandleType | null => {
        if (!design) return null;

        //const { x, y } = design.position;
        const x = design.position.x * dimensions.width / 100;
        const y = design.position.y * dimensions.height / 100;
       //converting to PX from %
        const width = design.dimensions.width * dimensions.width / 100;
        const height = design.dimensions.height * dimensions.height / 100;

        const handles = {
            'top-left': [x, y],
            'top-right': [x + width, y],
            'bottom-right': [x + width, y + height],
            'bottom-left': [x, y + height],
            'top': [x + width / 2, y],
            'right': [x + width, y + height / 2],
            'bottom': [x + width / 2, y + height],
            'left': [x, y + height / 2],
            'null': [0, 0], // Default for no handle
        } as const;

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

    // Draw all the blocks on the canvas
    const drawDesigns = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;
        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw border
        context.strokeStyle = 'black';
        context.lineWidth = border;
        context.strokeRect(0, 0, canvas.width, canvas.height);

        blocks.forEach((design) => {
            drawDesign(design, context);
        });

        context.restore();
    };
    // Draw a single design on the canvas
    const drawDesign = (design: UnifiedBlock, context: CanvasRenderingContext2D) => {
        //const { x, y } = design.position;
        //converting to PX from %
        const x = design.position.x * dimensions.width / 100;
        const y = design.position.y * dimensions.height / 100;
        const width = design.dimensions.width * dimensions.width / 100;
        const height = design.dimensions.height * dimensions.height / 100;

        context.save();
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.strokeRect(x, y, width, height);

        // Draw the text
        
        var text: string;
        if ('textParameter' in design) {
            text = textParametersMap.get(design.textParameter) || '';
        } else if ('type' in design) {
            text = design.type;
        } else {
            text = 'None';
        }
        context.fillStyle = design.color; // Text color
        context.textBaseline = 'top';
        context.font = design.font;
        context.fillText(text, x, y);

        // Draw a border around the selected design
        if (selectedBlock && design.id === selectedBlock.id) {
            context.strokeStyle = 'black';
            context.lineWidth = 2;
            context.strokeRect(x, y, width, height);
        }

        // Draw the resize handles
        if (design.id === selectedBlock?.id) {
            drawResizeHandle(context, x, y);
            drawResizeHandle(context, x + width, y);
            drawResizeHandle(context, x, y + height);
            drawResizeHandle(context, x + width, y + height);

            // Draw additional handles
            drawResizeHandle(context, x + width / 2, y);
            drawResizeHandle(context, x, y + height / 2);
            drawResizeHandle(context, x + width, y + height / 2);
            drawResizeHandle(context, x + width / 2, y + height);

        }
        context.save();
    };
    // Draw a single resize handle
    const drawResizeHandle = (context: CanvasRenderingContext2D, x: number, y: number) => {
        context.fillStyle = 'red';
        context.fillRect(x - 4, y - 4, 8, 8);
    };
  
    return (
        <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ border: '1px solid #000', marginBottom: '10px' }}
        ></canvas>
    );
};

export default Canvas;