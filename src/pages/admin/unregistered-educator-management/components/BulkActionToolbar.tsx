import React from "react";

interface BulkActionToolbarProps {
    selectedCount: number;
    onBulkUnregister?: () => void;
    onClearSelection: () => void;
}

const BulkActionToolbar: React.FC<BulkActionToolbarProps> = ({
    selectedCount,
    onBulkUnregister,
    onClearSelection,
}) => {
    return (
        <div className="mb-6 p-4 rounded-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-textColor font-bold">
                        {selectedCount} educator{selectedCount !== 1 ? "s" : ""} selected
                    </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {onBulkUnregister && (
                        <button
                            onClick={onBulkUnregister}
                            className="bg-primary cursor-pointer hover:bg-hover text-white px-8 py-3 rounded-lg font-bold transition-colors min-w-[140px] text-center"
                        >
                            Unregister All
                        </button>
                    )}
                    <button
                        onClick={onClearSelection}
                        className="bg-white border cursor-pointer border-primary text-textColor hover:bg-primary/10 px-8 py-3 rounded-lg font-bold transition-colors min-w-[140px] text-center"
                    >
                        Clear Selection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkActionToolbar;