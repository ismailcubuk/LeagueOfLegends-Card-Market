import { useEffect } from 'react';

export default function useBodyScrollLock(isLocked) {
    useEffect(() => {
        if (!isLocked) {
            return undefined;
        }

        const previousHtmlOverflow = document.documentElement.style.overflow;
        const previousBodyOverflow = document.body.style.overflow;

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        return () => {
            document.documentElement.style.overflow = previousHtmlOverflow;
            document.body.style.overflow = previousBodyOverflow;
        };
    }, [isLocked]);
}
