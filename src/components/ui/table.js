import * as React from "react";

export function Table({ className = "", ...props }) {
  return (
    <table className={`w-full border-collapse ${className}`} {...props} />
  );
}

export function TableHeader(props) {
  return <thead {...props} />;
}

export function TableBody(props) {
  return <tbody {...props} />;
}

export function TableRow(props) {
  return <tr className="border-b" {...props} />;
}

export function TableHead({ className = "", ...props }) {
  return (
    <th
      className={`px-4 py-2 text-left text-sm font-semibold text-slate-600 ${className}`}
      {...props}
    />
  );
}

export function TableCell({ className = "", ...props }) {
  return (
    <td
      className={`px-4 py-2 text-sm text-slate-700 ${className}`}
      {...props}
    />
  );
}
