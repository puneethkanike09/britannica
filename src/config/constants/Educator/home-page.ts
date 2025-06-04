// Grade, Theme, and Type options for Educator Home Page
import { SelectOption } from '../../../types/educator';

export const gradeOptions: SelectOption[] = [
    { value: '1', label: 'Grade 3' },
    { value: '2', label: 'Grade 4' },
    { value: '3', label: 'Grade 5' },
    { value: '4', label: 'Grade 6' },
    { value: '5', label: 'Grade 7' },
    { value: '6', label: 'Grade 8' },
    { value: '7', label: 'Grade 9' },
    { value: '8', label: 'Grade 10' },
    { value: '9', label: 'Grade 11' },
    { value: '10', label: 'Grade 12' },
];

export const themeOptions: SelectOption[] = [
    { value: 'environment', label: 'Environment' },
    { value: 'entrepreneurship', label: 'Entrepreneurship' },
    { value: 'ai_robotics', label: 'AI & Robotics' },
    { value: 'cultural_development', label: 'Cultural Development' },
    { value: 'social_emotional_learning', label: 'Social Emotional Learning' },
    { value: 'vocational_education', label: 'Vocational Education' },
];

export const typeOptions: SelectOption[] = [
    { value: 'educator_navigation', label: 'Educator Navigation' },
    { value: 'students_explorer', label: 'Students Explorer' },
];
