"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { notFound } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function GenericIdPage({ params }: { params: { id: string } }) {
    // Check if params is a Promise before using React.use()
    const resolvedParams = params instanceof Promise ? React.use(params) : params;
    

    return (
        <div>hellowrld
            <div>
                {resolvedParams.id}
            </div>
        </div>
    )
}