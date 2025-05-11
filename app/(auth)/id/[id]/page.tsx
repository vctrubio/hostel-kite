"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { notFound } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function GenericIdPage({ params }: { params: { id: string } }) {
    // Check if params is a Promise before using React.use()
    const resolvedParams = params instanceof Promise ? React.use(params) : params;
    
    // Use the ID directly from resolvedParams
    const getId = useQuery(api.utils.getId, { id: resolvedParams.id });

    if (getId === undefined) {
        return <div>Loading ID data...</div>;
    }
    
    if (getId === null) {
        return <div>ID not found</div>;
    }

    return (
        <div>
            <h1>User Details</h1>
            <div>Params passed: {resolvedParams.id}</div>
            <div>
                <pre>{JSON.stringify(getId, null, 2)}</pre>
            </div>
        </div>
    )
}