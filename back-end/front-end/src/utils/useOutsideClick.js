import { useEffect } from 'react';

export function useOutsideClick(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            // ref가 존재하지 않거나, 클릭된 요소가 ref 내부에 있으면 아무것도 하지 않음
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(); // 외부 클릭 발생 시 핸들러 실행
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]); // ref와 handler가 변경될 때마다 효과 재실행
}
