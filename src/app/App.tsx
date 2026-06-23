import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './Layout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Toaster } from '@/components/ui/sonner'

const JsonFormatter = lazy(() => import('@/tools/json/JsonFormatter'))
const DiffChecker = lazy(() => import('@/tools/diff/DiffChecker'))
const Base64Tool = lazy(() => import('@/tools/base64/Base64Tool'))
const HashGenerator = lazy(() => import('@/tools/hash/HashGenerator'))
const RegexTester = lazy(() => import('@/tools/regex/RegexTester'))
const UuidGenerator = lazy(() => import('@/tools/uuid/UuidGenerator'))

function RouteSkeleton() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-6 w-6 animate-pulse rounded-[6px] bg-[#161b22]" />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/json" replace />} />
            <Route
              path="/json"
              element={
                <Suspense fallback={<RouteSkeleton />}>
                  <ErrorBoundary idbKeys={['json:input', 'json:output']}>
                    <JsonFormatter />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/diff"
              element={
                <Suspense fallback={<RouteSkeleton />}>
                  <ErrorBoundary idbKeys={['diff:left', 'diff:right']}>
                    <DiffChecker />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/base64"
              element={
                <Suspense fallback={<RouteSkeleton />}>
                  <ErrorBoundary>
                    <Base64Tool />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/hash"
              element={
                <Suspense fallback={<RouteSkeleton />}>
                  <ErrorBoundary>
                    <HashGenerator />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/regex"
              element={
                <Suspense fallback={<RouteSkeleton />}>
                  <ErrorBoundary>
                    <RegexTester />
                  </ErrorBoundary>
                </Suspense>
              }
            />
            <Route
              path="/uuid"
              element={
                <Suspense fallback={<RouteSkeleton />}>
                  <ErrorBoundary>
                    <UuidGenerator />
                  </ErrorBoundary>
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ErrorBoundary>
  )
}
