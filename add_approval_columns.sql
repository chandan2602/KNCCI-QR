-- Add approval columns to courses table
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS course_approval_status VARCHAR(50) DEFAULT 'Pending',
ADD COLUMN IF NOT EXISTS approved_by INTEGER,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS approval_comments TEXT;

-- Create index for faster filtering by approval status
CREATE INDEX IF NOT EXISTS idx_course_approval_status
ON public.courses USING btree(course_approval_status COLLATE pg_catalog."default" ASC NULLS LAST);

-- Update existing courses to have 'Approved' status (so they show up immediately)
UPDATE public.courses 
SET course_approval_status = 'Approved' 
WHERE course_approval_status IS NULL OR course_approval_status = 'Pending';

COMMENT ON COLUMN public.courses.course_approval_status IS 'Approval status: Pending, Approved, Rejected';
COMMENT ON COLUMN public.courses.approved_by IS 'User ID of super admin who approved/rejected';
COMMENT ON COLUMN public.courses.approved_at IS 'Timestamp when course was approved/rejected';
COMMENT ON COLUMN public.courses.approval_comments IS 'Comments from super admin during approval/rejection';
