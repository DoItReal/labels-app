import React, { useEffect, useRef, useState } from 'react';
import { UnifiedDesign, textFieldDesign,imageFieldDesign, HandleType, Position, TtextParameter } from './Playground'; // Import the Design type
import { styled } from '@mui/system';

const StyledCanvas = styled('canvas')`
  border: 1px solid #000;
  margin-bottom: 10px;
`;
interface CanvasProps {
    designs: UnifiedDesign[];
    selectedDesign: UnifiedDesign | null;
    setSelectedDesign: React.Dispatch<React.SetStateAction<UnifiedDesign | null>>;
    setDesigns: React.Dispatch<React.SetStateAction<UnifiedDesign[]>>;
  //  selectedTextParameter: TtextParameter; // Add selectedTextParameter
    
}


const Canvas: React.FC<CanvasProps> = ({ designs, selectedDesign, setSelectedDesign, setDesigns }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<Position | null>(null);
    const [resizeHandle, setResizeHandle] = useState<HandleType | null>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const handleDeleteKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Delete' && selectedDesign) {
                setDesigns(prevDesigns => prevDesigns.filter(design => design.id !== selectedDesign.id));
                setSelectedDesign(null); // Clear the selected design after deletion
            }
        };

        window.addEventListener('keydown', handleDeleteKeyPress);

       
        context.clearRect(0, 0, canvas.width, canvas.height);

        designs.forEach((design) => {
            const { x, y } = design.position;

            context.strokeStyle = design.color;
            context.strokeRect(x, y, design.dimensions.width, design.dimensions.height);

            const textDB: Record<string, string> = { bg: 'Bulgarian', en: 'English', de: 'Deutsch', rus: 'Russian' };
            var text: string;
            if ('textParameter' in design) {
                text = textDB[design.textParameter];
            } else if ('type' in design) {
                text = design.type;
            } else {
                text = 'None';
            }
            context.fillStyle = 'black'; // Text color
            context.textBaseline = 'top';
            context.font = design.font;
            context.fillText(text, x, y);

            if (selectedDesign && design.id === selectedDesign.id) {
                context.strokeStyle = 'black';
                context.lineWidth = 2;
                context.strokeRect(x, y, design.dimensions.width, design.dimensions.height);
            }
        });
        return () => {
            window.removeEventListener('keydown', handleDeleteKeyPress);
        };
    }, [canvasRef, designs, selectedDesign, setDesigns, setSelectedDesign]);

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

        const clickedDesign = designs.find((design) => {
            const clickedHandle = checkResizeHandle(mouseX, mouseY, design);
            if (clickedHandle) {
                setResizeHandle(clickedHandle);
                setIsDragging(false);
                setDragStart(null);
                return true; // Stop further processing, we're in resize mode
            }

            return (
                mouseX >= design.position.x &&
                mouseX <= design.position.x + design.dimensions.width &&
                mouseY >= design.position.y &&
                mouseY <= design.position.y + design.dimensions.height
            );
        });

        if (clickedDesign) {
            setIsDragging(true);
            setDragStart({ x: mouseX - clickedDesign.position.x, y: mouseY - clickedDesign.position.y });
            setSelectedDesign(clickedDesign);
        } else {
            // If no object is clicked, deselect the selected object
            setSelectedDesign(null);
        }
    };
    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        animationRef.current = requestAnimationFrame(() => {
             drawDesigns();
        });
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

        if ((isDragging || resizeHandle) && selectedDesign && dragStart !== null) {
            const rect = canvasRef.current?.getBoundingClientRect();
            const mouseX = clientX - (rect?.left || 0);
            const mouseY = clientY - (rect?.top || 0);

            setDesigns((prevDesigns) =>
                prevDesigns.map((prevDesign) => {
                    if (prevDesign.id === selectedDesign.id) {
                        const { x, y } = prevDesign.position;
                        const { width, height } = prevDesign.dimensions;

                        let newWidth = width;
                        let newHeight = height;
                        let newX = x;
                        let newY = y;

                        if (resizeHandle) {
                            if (resizeHandle.includes('right')) {
                                newWidth = mouseX - x;
                            } else if (resizeHandle.includes('left')) {
                                newWidth = x + width - mouseX;
                                newX = mouseX;
                            }

                            if (resizeHandle.includes('bottom')) {
                                newHeight = mouseY - y;
                            } else if (resizeHandle.includes('top')) {
                                newHeight = y + height - mouseY;
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

                        return {
                            ...prevDesign,
                            position: {
                                x: newX,
                                y: newY,
                            },
                            dimensions: {
                                width: newWidth,
                                height: newHeight,
                            },
                        };
                    }
                    return prevDesign;
                })
            );
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragStart(null);
        setResizeHandle(null);
    };

    const checkResizeHandle = (
        mouseX: number,
        mouseY: number,
        design: UnifiedDesign | undefined
    ): HandleType | null => {
        if (!design) return null;

        const { x, y } = design.position;
        const { width, height } = design.dimensions;

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
    interface TextDatabase {
        [key: string]: string;
    }
    const drawDesigns = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);

        designs.forEach((design) => {
            const { x, y } = design.position;

            context.strokeStyle = design.color;
            context.strokeRect(x, y, design.dimensions.width, design.dimensions.height);

            //**** TO DO !!! getting data from DB array*/
            const textDB: TextDatabase = { bg: 'Bulgarian', en: 'English', de: "Deutsch", rus:"Russian" };
            // Draw the text
            var text: string;
            if ('textParameter' in design) {
                text = textDB[design.textParameter];
            } else if ('type' in design) {
                text = design.type;
            } else {
                text = 'None';
            }
            context.fillStyle = 'black'; // Text color
            context.textBaseline = 'top';
            context.font = design.font;
            context.fillText(text, x, y);

            // Draw a border around the selected design
            if (selectedDesign && design.id === selectedDesign.id) {
                context.strokeStyle = 'black';
                context.lineWidth = 2;
                context.strokeRect(x, y, design.dimensions.width, design.dimensions.height);
            }

            // Draw the resize handles
            if (design.id === selectedDesign?.id) {
                drawResizeHandle(context, x, y);
                drawResizeHandle(context, x + design.dimensions.width, y);
                drawResizeHandle(context, x, y + design.dimensions.height);
                drawResizeHandle(context, x + design.dimensions.width, y + design.dimensions.height);

                // Draw additional handles
                drawResizeHandle(context, x + design.dimensions.width / 2, y);
                drawResizeHandle(context, x, y + design.dimensions.height / 2);
                drawResizeHandle(context, x + design.dimensions.width, y + design.dimensions.height / 2);
                drawResizeHandle(context, x + design.dimensions.width / 2, y + design.dimensions.height);

            }
        });
    };
    const drawResizeHandle = (context: CanvasRenderingContext2D, x: number, y: number) => {
        context.fillStyle = 'red';
        context.fillRect(x - 4, y - 4, 8, 8);
    };
    return (
        <canvas
            ref={canvasRef}
            width={400}
            height={300}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ border: '1px solid #000', marginBottom: '10px' }}
        ></canvas>
    );
};

export default Canvas;