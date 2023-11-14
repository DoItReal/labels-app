import React, { useRef, useState } from 'react';

interface Position {
    x: number;
    y: number;
}

interface Dimensions {
    width: number;
    height: number;
}

interface Design {
    id: number;
    position: Position;
    dimensions: Dimensions;
    font: string;
    color: string;
    textParameter: string;
}

type HandleType = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'right' | 'bottom' | 'left' | null;


const DesignPlayground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<Position | null>(null);
    const [resizeHandle, setResizeHandle] = useState<HandleType | null>(null);
    const [designs, setDesigns] = useState<Design[]>([
        { id: 1, position: { x: 50, y: 50 }, dimensions: { width: 100, height: 20 }, font: '20px Arial', color: 'blue',textParameter:'bg' },
        { id: 2, position: { x: 200, y: 50 }, dimensions: { width: 100, height: 20 }, font: '20px Arial', color: 'green', textParameter:'en' },
        { id: 3, position: { x: 350, y: 50 }, dimensions: { width: 100, height: 20 }, font: '20px Arial', color: 'red', textParameter:'de' },
    ]);

    const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        const mouseX = event.clientX - (rect?.left || 0);
        const mouseY = event.clientY - (rect?.top || 0);

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
        }
    };
    const checkResizeHandle = (
        mouseX: number,
        mouseY: number,
        design: Design | undefined
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
    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        drawDesigns();

        if ((isDragging || resizeHandle) && selectedDesign && dragStart !== null) {
            const rect = canvasRef.current?.getBoundingClientRect();
            const mouseX = event.clientX - (rect?.left || 0);
            const mouseY = event.clientY - (rect?.top || 0);

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

            const textDB: TextDatabase = { bg: 'Bulgarian', en: 'English', de: "Deutsch" };
            // Draw the text
            const text = textDB[design.textParameter] || '';
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

    const addDesign = () => {
        setDesigns((prevDesigns) => [
            ...prevDesigns,
            {
                id: prevDesigns.length + 1,
                position: { x: 350, y: 50 },
                dimensions: { width: 100, height: 20 },
                font: '20px Arial',
                color: 'red',
                textParameter: ''
            },
        ]);
    };

    const saveDesignsToDatabase = () => {
        // Save the designs to the database (you can replace this with your actual database saving logic)
        console.log('Designs saved to the database:', designs);
    };

    return (
        <div>
            <h2>React Design Playground</h2>
            <canvas
                ref={canvasRef}
                width={400}
                height={300}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ border: '1px solid #000' }}
            ></canvas>
            <div>
                <label>Selected Design:</label>
                <select
                    value={selectedDesign ? selectedDesign.id : undefined}
                    onChange={(e) => {
                        const selectedId = parseInt(e.target.value, 10);
                        const selected = designs.find((design) => design.id === selectedId) || null;
                        setSelectedDesign(selected);
                    }}
                >
                    <option value={undefined}>None</option>
                    {designs.map((design) => (
                        <option key={design.id} value={design.id}>
                            Design {design.id}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                {designs.map((design) => (
                    <div key={design.id}>
                        <h3>Design {design.id}</h3>
                        <label>Position X:</label>
                        <input
                            type="range"
                            value={design.position.x}
                            min="0"
                            max="400"
                            onChange={(e) =>
                                setDesigns((prevDesigns) =>
                                    prevDesigns.map((prevDesign) =>
                                        prevDesign.id === design.id
                                            ? { ...prevDesign, position: { ...prevDesign.position, x: Number(e.target.value) } }
                                            : prevDesign
                                    )
                                )
                            }
                        />
                        <label>Position Y:</label>
                        <input
                            type="range"
                            value={design.position.y}
                            min="0"
                            max="300"
                            onChange={(e) =>
                                setDesigns((prevDesigns) =>
                                    prevDesigns.map((prevDesign) =>
                                        prevDesign.id === design.id
                                            ? { ...prevDesign, position: { ...prevDesign.position, y: Number(e.target.value) } }
                                            : prevDesign
                                    )
                                )
                            }
                        />
                        <label>Width:</label>
                        <input
                            type="range"
                            value={design.dimensions.width}
                            min="20"
                            max="200"
                            onChange={(e) =>
                                setDesigns((prevDesigns) =>
                                    prevDesigns.map((prevDesign) =>
                                        prevDesign.id === design.id
                                            ? { ...prevDesign, dimensions: { ...prevDesign.dimensions, width: Number(e.target.value) } }
                                            : prevDesign
                                    )
                                )
                            }
                        />
                        <label>Height:</label>
                        <input
                            type="range"
                            value={design.dimensions.height}
                            min="20"
                            max="200"
                            onChange={(e) =>
                                setDesigns((prevDesigns) =>
                                    prevDesigns.map((prevDesign) =>
                                        prevDesign.id === design.id
                                            ? { ...prevDesign, dimensions: { ...prevDesign.dimensions, height: Number(e.target.value) } }
                                            : prevDesign
                                    )
                                )
                            }
                        />
                        <label>Selected Text Parameter:</label>
                        <select
                            value={design.textParameter}
                            onChange={(e) =>
                                setDesigns((prevDesigns) =>
                                    prevDesigns.map((prevDesign) =>
                                        prevDesign.id === design.id
                                            ? { ...prevDesign, textParameter: e.target.value }
                                            : prevDesign
                                    )
                                )
                            }
                        >
                            <option value="bg">Bulgarian</option>
                            <option value="en">English</option>
                            <option value="de">Deutsch</option>
                        </select>
                    </div>
                ))}
            </div>
            <button onClick={saveDesignsToDatabase}>Save Designs</button>
            <button onClick={addDesign}>Add Design</button>
        </div>
    );
};

export default DesignPlayground;
