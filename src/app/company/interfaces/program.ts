/**
 *
 *
 * @export
 * @interface Module
 */
export interface Module {
  title: string;
  licensecode?: string;
  hasLicense?: boolean;
  menuitem?: string;
  hasUserRights?: boolean;
  childs: Array<Module | Program>;
  isChildPathActive?: boolean;
}

/**
 *
 *
 * @export
 * @interface Program
 */
export interface Program {
  title: string;
  path: string;
  menuitem?: string;
  hasUserRights?: boolean;
}
