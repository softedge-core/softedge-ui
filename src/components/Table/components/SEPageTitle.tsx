import React from "react"

interface PageTitleProps extends React.HTMLAttributes<HTMLDivElement> {
    titleName: string
}

export default function PageTitle({titleName}: PageTitleProps) {
    return (
        <>
            <div className="text-2xl pb-4">{titleName}</div>
        </>
    )
}