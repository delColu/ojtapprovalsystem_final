import { Link } from '@inertiajs/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function TableHeading({ children, href = null, className = '', ...props }) {
    const contentClasses = `
        px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
        hover:text-gray-700 ${className}
    `;

    if (href) {
        return (
            <Link href={href} className={contentClasses} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <th className={contentClasses} {...props}>
            {children}
        </th>
    );
}

