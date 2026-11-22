import {describe,it,expect} from 'vitest';
import {availablePriority,scale,priorityPosition,localDay,actionInput} from '@/features/home/rules';
describe('Daily life rules',()=>{
 it('allows at most three priority positions',()=>{expect(priorityPosition.parse(3)).toBe(3);expect(priorityPosition.safeParse(4).success).toBe(false);expect(priorityPosition.safeParse(0).success).toBe(false);expect(availablePriority([1,2,3])).toBeUndefined();expect(availablePriority([1,3])).toBe(2);});
 it('mood is an integer from 1 to 5',()=>{expect(scale.parse(1)).toBe(1);expect(scale.parse(5)).toBe(5);expect(actionInput.safeParse({action:'checkin',field:'mood',value:0}).success).toBe(false);expect(actionInput.safeParse({action:'checkin',field:'mood',value:6}).success).toBe(false);});
 it('energy is an integer from 1 to 5',()=>{expect(actionInput.safeParse({action:'checkin',field:'energy',value:5}).success).toBe(true);expect(actionInput.safeParse({action:'checkin',field:'energy',value:1.5}).success).toBe(false);expect(actionInput.safeParse({action:'checkin',field:'energy',value:6}).success).toBe(false);});
 it('assigns priorities and check-ins to the users local date',()=>{expect(localDay('Africa/Algiers',new Date('2026-11-22T23:30:00Z'))).toBe('2026-11-23');expect(localDay('UTC',new Date('2026-11-22T23:30:00Z'))).toBe('2026-11-22');});
});
