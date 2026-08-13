import { useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError() as any;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-heading font-bold text-primary mb-4">Oops!</h1>
        <p className="text-lg font-paragraph text-foreground mb-2">
          Something went wrong
        </p>
        <p className="text-sm font-paragraph text-foreground/60 mb-8">
          {error?.statusText || error?.message || 'An unexpected error occurred'}
        </p>
        <Link to="/">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
