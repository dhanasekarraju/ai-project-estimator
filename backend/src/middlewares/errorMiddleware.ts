import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
};

export const notFound = (req: Request, res: Response) => {
    res.status(404).json({ error: 'Endpoint not found' });
};