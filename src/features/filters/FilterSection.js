import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const filterContentVariants = {
    closed: {
        height: 0,
        opacity: 0,
        y: -4,
        transition: {
            duration: 0.18,
            ease: 'easeInOut',
        },
    },
    open: {
        height: 'auto',
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.24,
            ease: 'easeOut',
        },
    },
};

export default function FilterSection({ title, isOpen, onToggle, last = false, children }) {
    return (
        <section className={`filter-section ${last ? 'filter-section-last' : ''} ${isOpen ? '' : 'filter-section-closed'}`}>
            <button
                type='button'
                className='filter-section-trigger'
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <span>{title}</span>
                <ChevronDown size={16} strokeWidth={2.2} className='filter-chevron' />
            </button>
            <AnimatePresence initial={false}>
                {isOpen ? (
                    <motion.div
                        className='filter-section-content'
                        initial='closed'
                        animate='open'
                        exit='closed'
                        variants={filterContentVariants}
                    >
                        {children}
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </section>
    );
}

