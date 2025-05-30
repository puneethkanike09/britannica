// report page

export interface ActivityLog {
    id: number;
    date: string;
    time: string;
    activity: string;
    user: string;
}

//school management page
export interface School {
    id: number;
    name: string;
    email: string;
    phone: string;
    address?: string;
}
export interface AddSchoolModalProps {
    onClose: () => void;
}
export interface SchoolActionModalProps {
    onClose: () => void;
    school: School;
}


// teacher management page
export interface Teacher {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    loginId: string;
    schoolId?: number;
}

export interface AddTeacherModalProps {
    onClose: () => void;
}

export interface TeacherActionModalProps {
    onClose: () => void;
    teacher: Teacher;
}



