import React, { memo } from "react";
import ThreeDBoard from "./ThreeDBoard";

const VisualizerWrapper = memo(({ data }: { data: any }) => {
    return <ThreeDBoard initialScene={data} />;
}, (prev, next) => {
    // Only re-render if the 'data' specifically changes
    // (Ignores chat input typing, sidebar toggles, etc.)
    return JSON.stringify(prev.data) === JSON.stringify(next.data);
});

export default VisualizerWrapper;