using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class addColumPayToMoneyToTableOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PayToMoneyId",
                table: "Orders",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Orders_PayToMoneyId",
                table: "Orders",
                column: "PayToMoneyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_PayToMoneys_PayToMoneyId",
                table: "Orders",
                column: "PayToMoneyId",
                principalTable: "PayToMoneys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_PayToMoneys_PayToMoneyId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_PayToMoneyId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "PayToMoneyId",
                table: "Orders");
        }
    }
}
