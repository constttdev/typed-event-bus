declare function createBus(): {
    on: (event: string, fn: (data?: any) => void | Promise<void>) => void;
    off: (event: string, fn: (data?: any) => void | Promise<void>) => void;
    emit: (event: string, data?: any) => Promise<void>;
    once: (event: string, fn: (data?: any) => void | Promise<void>) => void;
};

export { createBus };
