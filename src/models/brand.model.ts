/**
 * Brand model
 * 
 * Defines the data structure for brand entities
 */
import { z } from "zod";

// Brand schema validator
export const BrandSchema = z.object({
    id: z.string().describe("Unique identifier for the brand"),
    name: z.string().describe("Name of the brand"),
});

// Brand type definition
export type Brand = z.infer<typeof BrandSchema>;

// Brand relationship type
export type BrandRelationship = {
    time: string;
    in: string;
    out: string;
};
