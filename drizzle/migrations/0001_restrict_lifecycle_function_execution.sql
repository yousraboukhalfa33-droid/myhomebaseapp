REVOKE EXECUTE ON FUNCTION public.create_signup_profile() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.convert_capture_to_task(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.convert_capture_to_task(uuid) TO authenticated;