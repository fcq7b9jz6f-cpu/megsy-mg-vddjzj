import * as React from 'react';
import { cn } from '@/lib/utils';
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className,...p},ref)=><div ref={ref} className={cn('rounded-lg border bg-card text-card-foreground shadow-sm',className)} {...p}/>);
Card.displayName='Card';
export const CardHeader = (p:any)=> <div className={cn('flex flex-col space-y-1.5 p-6',p.className)} {...p}/>;
export const CardTitle = (p:any)=> <h3 className={cn('text-2xl font-semibold leading-none tracking-tight',p.className)} {...p}/>;
export const CardDescription = (p:any)=> <p className={cn('text-sm text-muted-foreground',p.className)} {...p}/>;
export const CardContent = (p:any)=> <div className={cn('p-6 pt-0',p.className)} {...p}/>;
export const CardFooter = (p:any)=> <div className={cn('flex items-center p-6 pt-0',p.className)} {...p}/>;
