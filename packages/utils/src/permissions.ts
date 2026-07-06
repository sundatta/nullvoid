import { PermissionFlagsBits, type GuildMember } from 'discord.js';

export class PermissionGuard {
  static hasPermission(member: GuildMember, permission: bigint): boolean {
    return member.permissions.has(permission);
  }

  static hasAnyPermission(member: GuildMember, permissions: bigint[]): boolean {
    return permissions.some((p) => member.permissions.has(p));
  }

  static hasAllPermissions(member: GuildMember, permissions: bigint[]): boolean {
    return permissions.every((p) => member.permissions.has(p));
  }

  static isAdministrator(member: GuildMember): boolean {
    return member.permissions.has(PermissionFlagsBits.Administrator);
  }

  static isModerator(member: GuildMember): boolean {
    return this.hasAnyPermission(member, [
      PermissionFlagsBits.ModerateMembers,
      PermissionFlagsBits.KickMembers,
      PermissionFlagsBits.BanMembers,
    ]);
  }

  static canManage(member: GuildMember, target: GuildMember): boolean {
    return member.roles.highest.comparePositionTo(target.roles.highest) > 0;
  }

  static canInteract(member: GuildMember, target: GuildMember): boolean {
    return this.canManage(member, target) || this.isAdministrator(member);
  }
}
