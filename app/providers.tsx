'use client'

import * as React from 'react'
const NextThemesProvider = dynamic(
	() => import('next-themes').then((e) => e.ThemeProvider),
	{
		ssr: false,
	}
)

import { type ThemeProviderProps } from 'next-themes/dist/types'
import { HeroUIProvider } from "@heroui/react";
import dynamic from 'next/dynamic'

export function Providers({ children, ...props }: ThemeProviderProps) {
	return <HeroUIProvider>
		<NextThemesProvider {...props}>
			{children}
		</NextThemesProvider>
	</HeroUIProvider>
}