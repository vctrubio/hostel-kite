import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export enum UserRole {
    ADMIN = 'admin',
    STUDENT = 'student',
    TEACHER = 'teacher',
}

interface AuthRolesProps {
    userId: Id<"users">;
    userRole: UserRole | string;
}

export function AuthRoles({ userId, userRole }: AuthRolesProps) {
    const linkManager = useMutation(api.models.admin.linkManagerAccount);
    const linkStudent = useMutation(api.models.admin.linkStudentAccount);
    const linkTeacher = useMutation(api.models.admin.linkTeacherAccount);
    
    console.log('AuthRoles called with userId:', userId, 'and userRole:', userRole);

    const handleRoleAssignment = async () => {
        try {
            if (userRole === UserRole.ADMIN) {
                await linkManager({ userId });
                console.log("User linked as admin");
            } else if (userRole === UserRole.STUDENT) {
                await linkStudent({ userId });
                console.log("User linked as student");
            } else if (userRole === UserRole.TEACHER) {
                await linkTeacher({ userId });
                console.log("User linked as teacher");
            }
        } catch (error) {
            console.error("Error linking account:", error);
        }
    };

    return (
        <div 
            className="border p-4 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={handleRoleAssignment}
        >
           id: {userId}, wants to become a: <span className="text-red-800">{userRole}</span>
        </div>
    );
}