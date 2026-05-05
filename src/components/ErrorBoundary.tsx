import React from "react";
export class ErrorBoundary extends React.Component<{children:React.ReactNode},{err?:Error}> {
  state={err:undefined as Error|undefined};
  static getDerivedStateFromError(err:Error){return{err}}
  componentDidCatch(err:Error){console.error(err)}
  render(){return this.state.err? <div className="p-8 text-center"><h2 className="text-2xl font-bold">حدث خطأ</h2><pre className="text-sm text-muted-foreground mt-2">{this.state.err.message}</pre></div> : this.props.children}
}
