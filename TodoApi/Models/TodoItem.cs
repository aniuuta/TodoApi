namespace TodoApi.Models
{
    public class TodoItem
    {
        public long CategoryId { get; set; }
        public ItemCategory? Category { get; set; }
        public long Id { get; set; }
        public string Name { get; set; }
        public bool IsComplete { get; set; }

    }
}
