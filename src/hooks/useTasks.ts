import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = '@timero_tasks';

export interface Task {
    id: string;
    title: string;
    estimatedPomodoros: number;
    completedPomodoros: number;
    createdAt: string;
    completedAt?: string;
    isCompleted: boolean;
}

export interface TasksState {
    tasks: Task[];
    activeTaskId: string | null;
}

const INITIAL_STATE: TasksState = {
    tasks: [],
    activeTaskId: null,
};

export const useTasks = () => {
    const [state, setState] = useState<TasksState>(INITIAL_STATE);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
            if (data) {
                setState(JSON.parse(data));
            }
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    };

    const saveTasks = async (newState: TasksState) => {
        setState(newState);
        try {
            await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(newState));
        } catch (error) {
            console.error('Failed to save tasks:', error);
        }
    };

    const addTask = useCallback(async (title: string, estimatedPomodoros: number) => {
        const newTask: Task = {
            id: Date.now().toString(),
            title,
            estimatedPomodoros,
            completedPomodoros: 0,
            createdAt: new Date().toISOString(),
            isCompleted: false,
        };
        const newState = {
            ...state,
            tasks: [...state.tasks, newTask],
        };
        await saveTasks(newState);
        return newTask;
    }, [state]);

    const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
        const newTasks = state.tasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
        );
        await saveTasks({ ...state, tasks: newTasks });
    }, [state]);

    const deleteTask = useCallback(async (taskId: string) => {
        const newTasks = state.tasks.filter(task => task.id !== taskId);
        const newActiveId = state.activeTaskId === taskId ? null : state.activeTaskId;
        await saveTasks({ tasks: newTasks, activeTaskId: newActiveId });
    }, [state]);

    const setActiveTask = useCallback(async (taskId: string | null) => {
        await saveTasks({ ...state, activeTaskId: taskId });
    }, [state]);

    const incrementPomodoro = useCallback(async () => {
        if (!state.activeTaskId) return;

        const newTasks = state.tasks.map(task => {
            if (task.id === state.activeTaskId) {
                const newCompleted = task.completedPomodoros + 1;
                const isNowComplete = newCompleted >= task.estimatedPomodoros;
                return {
                    ...task,
                    completedPomodoros: newCompleted,
                    isCompleted: isNowComplete,
                    completedAt: isNowComplete ? new Date().toISOString() : undefined,
                };
            }
            return task;
        });
        await saveTasks({ ...state, tasks: newTasks });
    }, [state]);

    const completeTask = useCallback(async (taskId: string) => {
        await updateTask(taskId, {
            isCompleted: true,
            completedAt: new Date().toISOString(),
        });
    }, [updateTask]);

    const getActiveTask = useCallback((): Task | null => {
        if (!state.activeTaskId) return null;
        return state.tasks.find(t => t.id === state.activeTaskId) || null;
    }, [state]);

    const getIncompleteTasks = useCallback((): Task[] => {
        return state.tasks.filter(t => !t.isCompleted);
    }, [state.tasks]);

    const getCompletedTasks = useCallback((): Task[] => {
        return state.tasks.filter(t => t.isCompleted);
    }, [state.tasks]);

    return {
        tasks: state.tasks,
        activeTaskId: state.activeTaskId,
        activeTask: getActiveTask(),
        incompleteTasks: getIncompleteTasks(),
        completedTasks: getCompletedTasks(),
        addTask,
        updateTask,
        deleteTask,
        setActiveTask,
        incrementPomodoro,
        completeTask,
    };
};
